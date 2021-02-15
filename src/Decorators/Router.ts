import { Router } from 'express';
import { getMeta, _handleHttpDecoratorReturn } from '..';
import { RouteMethod, MiddleWare, RouteDoc } from '..';

export function Route(
  method: RouteMethod,
  routeParams: { path?: string; middleWare?: MiddleWare[]; applyHttpError?: boolean } = {}
): (target: Record<string, any>, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor {
  const { path, middleWare, applyHttpError } = { path: '', middleWare: [], applyHttpError: true, ...routeParams };
  return function (
    target: Record<string, any>,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const meta = getMeta(target);
    meta.routes.set(propertyKey, { path: path, method: method, middleWare: middleWare });
    if (applyHttpError) {
      return _handleHttpDecoratorReturn(target, propertyKey, descriptor);
    }
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
  const meta = getMeta(Object.getPrototypeOf(controller));
  methods
    .filter(m => meta.routes.has(m))
    .map(m => {
      const routeDoc = meta.routes.get(m);
      controller[m] = controller[m].bind(controller);
      console.log(
        `Docjs: Binding ${controller.constructor.name}.${m} to ${routeDoc.method} @ ${meta.url}${routeDoc.path}`
      );
      router[routeDoc.method.toLowerCase()](`${meta.url}${routeDoc.path}`, ...routeDoc.middleWare, controller[m]);
    });
  console.log('\n');
}

export function getRoutes(controller: Record<string, any>): RouteDoc[] {
  const meta = getMeta(Object.getPrototypeOf(controller));
  return Array.from(meta.routes.values()).map(r => {
    return { path: meta.url + r.path, method: r.method };
  });
}
