import { Router } from 'express';
import { RouteDoc, getControllerDoc } from '..';

export function getRouteMethodNames(controller: Record<string, any>): string[] {
  return Object.getOwnPropertyNames(Object.getPrototypeOf(controller)).filter(name => {
    const method = controller[name];
    return method instanceof Function && name !== 'constructor';
  });
}

export function getRouteDocs(controller: Record<string, any>): RouteDoc[] {
  const meta = getControllerDoc(Object.getPrototypeOf(controller));
  return Array.from(meta.routes.values()).map(r => {
    const paths = r.paths.map(p => meta.path + p);
    return { paths: paths, method: r.method };
  });
}

export function initializeRoutes(router: Router, controller: Record<string, any>): void {
  const methods = getRouteMethodNames(controller);
  const controllerDoc = getControllerDoc(Object.getPrototypeOf(controller));
  methods
    .filter(m => controllerDoc.routes.has(m))
    .map(m => {
      const routeDoc = controllerDoc.routes.get(m);
      controller[m] = controller[m].bind(controller);
      routeDoc.paths.map(p => {
        console.log(
          `DocTs: Binding ${controller.constructor.name}.${m} to ${routeDoc.method} @ ${controllerDoc.path + p}`
        );
        router[routeDoc.method.toLowerCase()](controllerDoc.path + p, ...routeDoc.middleware, controller[m]);
      });
    });
  console.log('\n');
}
