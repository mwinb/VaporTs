import { Router } from 'express';
import { RouteDoc, getControllerDoc, docTsLogger, Generator, Middleware, ControllerDoc } from '..';

export function getRouteMethodNames(controller: Record<string, any>): string[] {
  return Object.getOwnPropertyNames(Object.getPrototypeOf(controller)).filter(name => {
    const method = controller[name];
    return method instanceof Function && name !== 'constructor';
  });
}

export function getRoutesDocumentation(controller: Record<string, any>): RouteDoc[] {
  const meta = getControllerDoc(Object.getPrototypeOf(controller));
  return Array.from(meta.routes.values()).map(r => {
    const paths = r.paths.map(p => meta.path + p);
    return { paths: paths, method: r.method };
  });
}

export const applyModifiers = (
  originalFunction: (...args: any[]) => Promise<any> | any,
  generators: Generator[]
): Middleware => {
  let newFn = originalFunction;
  generators.forEach(g => {
    newFn = g(newFn);
  });
  return newFn;
};

export const getModifiedRouteMethod = (
  generators: Generator[],
  method: (...args: any) => Promise<any> | any
): Middleware => {
  return generators ? applyModifiers(method, generators) : method;
};

export const getRouteDoc = (controllerDoc: ControllerDoc, key: string): RouteDoc => {
  let routeDoc = controllerDoc.routes.get(key);
  if (!routeDoc) {
    routeDoc = {
      paths: [],
      middleware: [],
      method: 'GET',
      generators: []
    };
  }
  return routeDoc;
};

const getBoundFunction = (controller: Record<string, any>, methodName: string): any => {
  return controller[methodName].bind(controller);
};

export function initializeRoutes(router: Router, controller: Record<string, any>): void {
  const methods = getRouteMethodNames(controller);
  const controllerDoc = getControllerDoc(Object.getPrototypeOf(controller));
  methods
    .filter(method => controllerDoc.routes.has(method))
    .map(method => {
      const routeDoc = controllerDoc.routes.get(method);
      const boundMethod = getBoundFunction(controller, method);
      routeDoc.paths.map(path => {
        docTsLogger.log(
          `DocTs: Binding ${controller.constructor.name}.${method} to ${routeDoc.method} @ ${controllerDoc.path + path}`
        );
        router[routeDoc.method.toLowerCase()](
          controllerDoc.path + path,
          ...routeDoc.middleware,
          getModifiedRouteMethod(routeDoc.generators, boundMethod)
        );
      });
    });
  docTsLogger.log('\n');
}
