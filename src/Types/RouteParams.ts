import { Middleware } from './Middleware';

export type RouteParams = { path?: string; middleware?: Middleware[]; applyHttpError?: boolean };
