import {
  RouteMethod,
  RouteParams,
  getControllerDoc,
  applyResponseHandler,
  applyHttpErrorHandler,
  PropertyDescriptorDecorator
} from '..';

const applyHandlers = (descriptor: PropertyDescriptor, routeConfig: RouteParams): PropertyDescriptor => {
  routeConfig.handleResponse && applyResponseHandler(routeConfig.responseCode, descriptor);
  routeConfig.applyHttpError && applyHttpErrorHandler(descriptor);
  return descriptor;
};

export function Route(
  method: RouteMethod,
  { path = '', middleware = [], applyHttpError = true, handleResponse = true, responseCode = 200 }: RouteParams = {}
): PropertyDescriptorDecorator {
  return function (
    target: Record<string, any>,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const meta = getControllerDoc(target);
    const paths = typeof path === 'string' ? [path] : path;
    meta.routes.set(propertyKey, { paths: paths, method: method, middleware: middleware });
    return applyHandlers(descriptor, { path, middleware, applyHttpError, handleResponse, responseCode });
  };
}
