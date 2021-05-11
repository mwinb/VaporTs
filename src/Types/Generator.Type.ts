import { Middleware } from './Middleware.Type';

export type Generator = (...args: any[]) => Middleware;
