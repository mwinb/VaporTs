import { RouteMethod, RouteParams, getControllerDoc, generateHttpErrorHandler, getResponseHandlerGenerator } from '..';
import { getGenerators } from '../Helpers/Route.Helpers';

const addRouteConfigGenerators = (routeConfig: RouteParams, generators: any[]): any[] => {
  if (routeConfig.applyHttpError) generators.push(generateHttpErrorHandler);
  if (routeConfig.handleResponse) generators.push(getResponseHandlerGenerator(routeConfig.responseCode));
  return generators;
};

export function Route(
  method: RouteMethod,
  { path = '', middleware = [], applyHttpError = true, handleResponse = true, responseCode = 200 }: RouteParams = {}
): (...args: any[]) => void {
  return function (target: Record<string, any>, propertyKey: string, _descriptor: PropertyDescriptor): void {
    const routeConfig = { path, middleware, applyHttpError, handleResponse, responseCode };
    const controllerDoc = getControllerDoc(target);
    const paths = typeof path === 'string' ? [path] : path;
    controllerDoc.routes.set(propertyKey, {
      paths: paths,
      method: method,
      middleware: middleware,
      generators: addRouteConfigGenerators(routeConfig, getGenerators(controllerDoc.routes.get(propertyKey)))
    });
  };
}
