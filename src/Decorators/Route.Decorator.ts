import { RouteMethod, RouteParams, getControllerDoc, HttpErrorHandler } from '..';

export function Route(
  method: RouteMethod,
  { path = '', middleware = [], applyHttpError = true }: RouteParams = {}
): (target: Record<string, any>, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor {
  return function (
    target: Record<string, any>,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const meta = getControllerDoc(target);
    const paths = typeof path === 'string' ? [path] : path;
    meta.routes.set(propertyKey, { paths: paths, method: method, middleware: middleware });
    if (applyHttpError) {
      return HttpErrorHandler(target, propertyKey, descriptor);
    }
    return descriptor;
  };
}
