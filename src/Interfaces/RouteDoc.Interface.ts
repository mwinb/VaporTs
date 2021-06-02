import { Middleware, RouteMethod, Curryware } from '..';

export interface RouteDoc {
  method: RouteMethod;
  paths: string[];
  middleware?: Middleware[];
  curriers?: Curryware[];
}
