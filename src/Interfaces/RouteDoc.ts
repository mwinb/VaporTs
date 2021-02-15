import { MiddleWare, RouteMethod } from '..';

export interface RouteDoc {
  method: RouteMethod;
  path: string;
  middleWare?: MiddleWare[];
}
