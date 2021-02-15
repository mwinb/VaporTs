import { MiddleWare, RouteDoc } from '..';

export interface RouteDocMeta {
  url: string;
  routes: Map<string, RouteDoc>;
  middleWare: MiddleWare[];
}
