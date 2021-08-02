import { Middleware, RouteDoc } from '..';

export interface ControllerDoc {
  path: string | string[];
  routes: Map<string, RouteDoc>;
  middleware: Middleware[];
}

export interface VaporController {
  controllerDoc?: ControllerDoc;
}
