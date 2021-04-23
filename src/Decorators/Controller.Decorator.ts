import { getControllerDoc, Middleware } from '..';

export function Controller(path: string, middleware: Middleware[] = []) {
  return (target: any): any => {
    const controllerDoc = getControllerDoc(target.prototype);
    controllerDoc.path = path;
    controllerDoc.middleware = [...controllerDoc.middleware, ...middleware];
    return target;
  };
}
