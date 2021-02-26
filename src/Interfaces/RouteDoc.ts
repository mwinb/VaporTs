import { Middleware } from '../Types/Middleware';
import { RouteMethod } from '../Types/RouteMethod';

export interface RouteDoc {
  method: RouteMethod;
  path: string;
  middleware?: Middleware[];
}
