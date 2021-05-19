import {
  Generator,
  RouteMethod,
  getRouteDoc,
  RouteParams,
  getControllerDoc,
  DEFAULT_ROUTE_PARAMS,
  generateHttpErrorHandler,
  getResponseHandlerGenerator
} from '..';

const addRouteConfigGenerators = (routeConfig: RouteParams, generators: Generator[]): Generator[] => {
  if (routeConfig.handleErrors) generators.push(generateHttpErrorHandler);
  if (routeConfig.handleResponse) generators.push(getResponseHandlerGenerator(routeConfig.responseCode));
  return generators;
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
      generators: addRouteConfigGenerators(routeConfig, routeDoc.generators)
    });
  };
}
