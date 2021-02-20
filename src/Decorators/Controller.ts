import { Router } from 'express';
import { MiddleWare, RouteDoc, ExpressController } from '..';
import { ControllerDoc } from '../Interfaces';
export function Controller(path: string, middleWare: MiddleWare[] = []) {
  return (target: any): any => {
    const controllerDoc = getControllerDoc(target.prototype);
    controllerDoc.path = path;
    controllerDoc.middleware = [...controllerDoc.middleware, ...middleWare];
    return target;
  };
}

export function getControllerDoc(target: ExpressController): ControllerDoc {
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
  if (routeDoc.middleware.length) router.use(routeDoc.path, routeDoc.middleware);
}
