import { ControllerDoc, RouteDoc, AppAdapter, VaporController, generatePath, Middleware } from '..';

export function getControllerDoc(target: Record<string, any>): ControllerDoc {
  if (!target.controllerDoc) {
    target.controllerDoc = {
      path: '',
      routes: new Map<string, RouteDoc>(),
      middleware: []
    };
  }
  return target.controllerDoc;
}

const useControllerMiddleware = (path: string, middleware: Middleware[], router: AppAdapter): void => {
  if (middleware.length) router.use(path, ...middleware); 
}

export function initControllerMiddleware(router: AppAdapter, controller: Record<string, any>, basePath: string): void {
  const controllerDoc = getControllerDoc(controller);
  useControllerMiddleware(generatePath(basePath, controllerDoc.path), controllerDoc.middleware, router);
}

export const isVaporController = (object: Record<string, any>): object is VaporController => {
  return 'controllerDoc' in Object.getPrototypeOf(object);
};
