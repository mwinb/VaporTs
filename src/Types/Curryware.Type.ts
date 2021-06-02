import { Handler } from '..';
import { Middleware } from './Middleware.Type';

export type Curryware = (ogMethod: Middleware) => Handler;
