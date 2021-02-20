import { Router } from 'express';
import { ControllerDoc } from '../Interfaces/ControllerDoc';
import { RouteDoc } from '../Interfaces/RouteDoc';
import { Middleware } from '../Types/Middleware';

export function Controller(path: string, middleware: Middleware[] = []) {
  return (target: any): any => {
    const controllerDoc = getControllerDoc(target.prototype);
    controllerDoc.path = path;
    controllerDoc.middleware = [...controllerDoc.middleware, ...middleware];
    return target;
  };
}

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
