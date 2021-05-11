import { Router } from 'express';
import { RouteDoc, getControllerDoc, docTsLogger } from '..';
import { Middleware } from '../Types/Middleware.Type';

export function getRouteMethodNames(controller: Record<string, any>): string[] {
  return Object.getOwnPropertyNames(Object.getPrototypeOf(controller)).filter(name => {
    const method = controller[name];
    return method instanceof Function && name !== 'constructor';
  });
}

export function getRouteDocs(controller: Record<string, any>): RouteDoc[] {
  const meta = getControllerDoc(Object.getPrototypeOf(controller));
  return Array.from(meta.routes.values()).map(r => {
    const paths = r.paths.map(p => meta.path + p);
    return { paths: paths, method: r.method };
  });
}

export const applyGenerators = (originalFunction: any, generators: any[]): any => {
  let newFn = originalFunction;
  generators.forEach(g => {
    newFn = g(newFn);
  });
  return newFn;
};

export const getGeneratedFn = (generators: any[], method: any): Middleware => {
  return generators ? applyGenerators(method, generators) : method;
};

export const getGenerators = (routeDoc: RouteDoc): any[] => {
  return (routeDoc && routeDoc.generators) || [];
};

export function initializeRoutes(router: Router, controller: Record<string, any>): void {
  const methods = getRouteMethodNames(controller);
  const controllerDoc = getControllerDoc(Object.getPrototypeOf(controller));
  methods
    .filter(method => controllerDoc.routes.has(method))
    .map(method => {
      const routeDoc = controllerDoc.routes.get(method);
      controller[method] = controller[method].bind(controller);
      routeDoc.paths.map(path => {
        docTsLogger.log(
          `DocTs: Binding ${controller.constructor.name}.${method} to ${routeDoc.method} @ ${controllerDoc.path + path}`
        );
        router[routeDoc.method.toLowerCase()](
          controllerDoc.path + path,
          ...routeDoc.middleware,
          getGeneratedFn(getGenerators(routeDoc), controller[method])
        );
      });
    });
  docTsLogger.log('\n');
}
