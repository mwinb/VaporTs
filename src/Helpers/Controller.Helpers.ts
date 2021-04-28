import { Router } from 'express';
import { ControllerDoc, RouteDoc, DocTsController } from '..';

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

export function initControllerMiddleware(router: Router, controller: Record<string, any>): void {
  const routeDoc = getControllerDoc(controller);
  if (routeDoc.middleware.length) router.use(routeDoc.path, ...routeDoc.middleware);
}

export const isDocTsController = (object: Record<string, any>): object is DocTsController => {
  return 'controllerDoc' in Object.getPrototypeOf(object);
};
