import { Middleware, RouteMethod, Generator } from '..';

export interface RouteDoc {
  method: RouteMethod;
  paths: string[];
  middleware?: Middleware[];
  generators?: Generator[];
}
