import { MiddleWare, RouteDoc } from '..';

export interface ControllerDoc {
  path: string;
  routes: Map<string, RouteDoc>;
  middleware: MiddleWare[];
}
