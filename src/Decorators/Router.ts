import { Router } from 'express';
import { getControllerDoc, HttpErrorHandler } from '..';
import { RouteMethod, MiddleWare, RouteDoc } from '..';

type RouteParams = { path?: string; middleWare?: MiddleWare[]; applyHttpError?: boolean };
export function Route(
  method: RouteMethod,
  { path = '', middleWare = [], applyHttpError = true }: RouteParams = {}
): (target: Record<string, any>, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor {
  return function (
    target: Record<string, any>,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const meta = getControllerDoc(target);
    meta.routes.set(propertyKey, { path: path, method: method, middleWare: middleWare });
    if (applyHttpError) {
      return HttpErrorHandler(target, propertyKey, descriptor);
    }
    descriptor['meta'] = 'test';
    console.log();
    return descriptor;
  };
}

export function getRouterMethods(controller: Record<string, any>): string[] {
  return Object.getOwnPropertyNames(Object.getPrototypeOf(controller)).filter(name => {
    const method = controller[name];
    return method instanceof Function && name !== 'constructor';
  });
}

export function initializeRoutes(router: Router, controller: Record<string, any>): void {
  const methods = getRouterMethods(controller);
  const meta = getControllerDoc(Object.getPrototypeOf(controller));
  methods
    .filter(m => meta.routes.has(m))
    .map(m => {
      const routeDoc = meta.routes.get(m);
      controller[m] = controller[m].bind(controller);
      console.log(
        `Docjs: Binding ${controller.constructor.name}.${m} to ${routeDoc.method} @ ${meta.path}${routeDoc.path}`
      );
      router[routeDoc.method.toLowerCase()](`${meta.path}${routeDoc.path}`, ...routeDoc.middleWare, controller[m]);
    });
  console.log('\n');
}

export function getRoutes(controller: Record<string, any>): RouteDoc[] {
  const meta = getControllerDoc(Object.getPrototypeOf(controller));
  return Array.from(meta.routes.values()).map(r => {
    return { path: meta.path + r.path, method: r.method };
  });
}
