import { Middleware } from './Middleware';

export type RouteParams = { path?: string | string[]; middleware?: Middleware[]; applyHttpError?: boolean };
