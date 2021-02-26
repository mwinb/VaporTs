import { Middleware } from '../Types/MiddlewareType';
import { RouteMethod } from '../Types/RouteMethod';

export interface RouteDoc {
  method: RouteMethod;
  path: string;
  middleware?: Middleware[];
}
