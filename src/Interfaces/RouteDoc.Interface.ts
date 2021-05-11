import { Middleware } from '../Types/Middleware.Type';
import { RouteMethod } from '../Types/RouteMethod.Type';

export interface RouteDoc {
  method: RouteMethod;
  paths: string[];
  middleware?: Middleware[];
  generatedRouteFunction?: Middleware;
}
