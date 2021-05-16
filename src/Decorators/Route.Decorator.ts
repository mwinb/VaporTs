import {
  Generator,
  RouteMethod,
  getRouteDoc,
  RouteParams,
  getControllerDoc,
  generateHttpErrorHandler,
  getResponseHandlerGenerator
} from '..';

const addRouteConfigGenerators = (routeConfig: RouteParams, generators: Generator[]): Generator[] => {
  if (routeConfig.applyHttpError) generators.push(generateHttpErrorHandler);
  if (routeConfig.handleResponse) generators.push(getResponseHandlerGenerator(routeConfig.responseCode));
  return generators;
};

export function Route(
  method: RouteMethod,
  { path = '', middleware = [], applyHttpError = true, handleResponse = true, responseCode = 200 }: RouteParams = {}
): (...args: any[]) => void {
  return function (target: Record<string, any>, propertyKey: string): void {
    const controllerDoc = getControllerDoc(target);
    const paths = typeof path === 'string' ? [path] : path;
    const routeDoc = getRouteDoc(controllerDoc, propertyKey);
    const routeConfig = { path, middleware, applyHttpError, handleResponse, responseCode };
    controllerDoc.routes.set(propertyKey, {
      paths: paths,
      method: method,
      middleware: middleware,
      generators: addRouteConfigGenerators(routeConfig, routeDoc.generators)
    });
  };
}
