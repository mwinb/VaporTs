import { Middleware } from '../Types/Middleware';
import { RouteMethod } from '../Types/RouteMethod';

export interface RouteDoc {
  method: RouteMethod;
  paths: string[];
  middleware?: Middleware[];
}
