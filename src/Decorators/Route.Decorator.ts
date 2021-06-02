import {
  Curryware,
  RouteMethod,
  getRouteDoc,
  RouteParams,
  getControllerDoc,
  DEFAULT_ROUTE_PARAMS,
  curryHttpErrorHandler,
  getResponseHandlerCurryware
} from '..';

const addRouteConfigGenerators = (routeConfig: RouteParams, curriers: Curryware[]): Curryware[] => {
  if (routeConfig.handleErrors) curriers.push(curryHttpErrorHandler);
  if (routeConfig.handleResponse) curriers.push(getResponseHandlerCurryware(routeConfig.responseCode));
  return curriers;
};

export function Route(method: RouteMethod, routeParams: RouteParams = {}): (...args: any[]) => void {
  return function (target: Record<string, any>, propertyKey: string): void {
    const controllerDoc = getControllerDoc(target);
    const routeDoc = getRouteDoc(controllerDoc, propertyKey);
    const routeConfig = { ...DEFAULT_ROUTE_PARAMS, ...routeParams };
    const paths = typeof routeConfig.path === 'string' ? [routeConfig.path] : routeConfig.path;
    controllerDoc.routes.set(propertyKey, {
      paths: paths,
      method: method,
      middleware: routeConfig.middleware,
      curriers: addRouteConfigGenerators(routeConfig, routeDoc.curriers)
    });
  };
}
