import { Router } from 'express';
import { MiddleWare, RouteDoc, ExpressController } from '..';
import { RouteDocMeta } from '../Interfaces';
export function Controller(path: string, middleWare: MiddleWare[] = []) {
  return (target: any): Record<string, any> => {
    const meta = getMeta(target.prototype);
    meta.url = path;
    meta.middleWare = [...meta.middleWare, ...middleWare];
    return target;
  };
}

export function getMeta(target: ExpressController): RouteDocMeta {
  if (!target.routeDocMeta) {
    target.routeDocMeta = {
      url: '',
      routes: new Map<string, RouteDoc>(),
      middleWare: []
    };
  }
  return target.routeDocMeta;
}

export function initBaseRoute(router: Router, controller: Record<string, any>): void {
  const meta = getMeta(controller);
  if (meta.middleWare.length) router.use(meta.url, ...meta.middleWare);
}
