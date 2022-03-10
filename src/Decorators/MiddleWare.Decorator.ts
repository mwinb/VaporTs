import { getControllerDoc, Middleware, getRouteDoc } from "..";

export function MiddleWare(middleware: Middleware[]): (...args: any[]) => void {
    return function (target: Record<string, any>, propertyKey: string) {
        const controllerDoc = getControllerDoc(target);
        const routeDoc = getRouteDoc(controllerDoc, propertyKey);
        routeDoc.middleware = [...routeDoc.middleware, ...middleware];
        controllerDoc.routes.set(propertyKey, routeDoc);
    }
}