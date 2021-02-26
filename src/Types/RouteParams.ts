import { Middleware } from './MiddlewareType';

export type RouteParams = { path?: string; middleware?: Middleware[]; applyHttpError?: boolean };
