import { getControllerDoc, Middleware } from '..';

export function Controller<T extends { new (...args: any[]): any }>(path: string, middleware: Middleware[] = []) {
  return (target: T): T => {
    const controllerDoc = getControllerDoc(target.prototype);
    controllerDoc.path = path;
    controllerDoc.middleware = [...middleware, ...controllerDoc.middleware];
    return target;
  };
}
