import { ControllerDoc, RouteDoc, AppAdapter, VaporController } from '..';

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

export function initControllerMiddleware(router: AppAdapter, controller: Record<string, any>): void {
  const routeDoc = getControllerDoc(controller);
  if (routeDoc.middleware.length) router.use(routeDoc.path, ...routeDoc.middleware);
}

export const isVaporController = (object: Record<string, any>): object is VaporController => {
  return 'controllerDoc' in Object.getPrototypeOf(object);
};
