import { Router } from 'express';
import { RouteDoc, getControllerDoc, docLogger, Curryware, Middleware, ControllerDoc, bindingRouteMessage } from '..';

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

export const applyWrappers = (
  originalFunction: (...args: any[]) => Promise<any> | any,
  curriers: Curryware[]
): Middleware => {
  return curriers.reduce((modifiedFunction, g) => {
    return g(modifiedFunction);
  }, originalFunction);
};

export const getWrappedRouteMethod = (
  curriers: Curryware[],
  method: (...args: any) => Promise<any> | any
): Middleware => {
  return curriers ? applyWrappers(method, curriers) : method;
};

export const getRouteDoc = (controllerDoc: ControllerDoc, key: string): RouteDoc => {
  let routeDoc = controllerDoc.routes.get(key);
  if (!routeDoc) {
    routeDoc = {
      paths: [],
      middleware: [],
      method: 'GET',
      curriers: []
    };
  }
  return routeDoc;
};

const getBoundFunction = (controller: Record<string, any>, methodName: string): any => {
  return controller[methodName].bind(controller);
};

export function initializeRoutes(basePath: string, router: Router, controller: Record<string, any>): void {
  const methods = getRouteMethodNames(controller);
  const controllerDoc = getControllerDoc(Object.getPrototypeOf(controller));
  methods
    .filter(method => controllerDoc.routes.has(method))
    .map(method => {
      const routeDoc = controllerDoc.routes.get(method);
      const boundMethod = getBoundFunction(controller, method);
      routeDoc.paths.map(path => {
        docLogger.log(
          bindingRouteMessage(controller.constructor.name, method, routeDoc.method, `${controllerDoc.path}${path}`)
        );
        router[routeDoc.method.toLowerCase()](
          basePath + controllerDoc.path + path,
          ...routeDoc.middleware,
          getWrappedRouteMethod(routeDoc.curriers, boundMethod)
        );
      });
    });
}
