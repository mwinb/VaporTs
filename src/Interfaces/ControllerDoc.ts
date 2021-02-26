import { Middleware } from '../Types/MiddlewareType';
import { RouteDoc } from './RouteDoc';

export interface ControllerDoc {
  path: string;
  routes: Map<string, RouteDoc>;
  middleware: Middleware[];
}
