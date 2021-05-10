import { Middleware } from './Middleware.Type';

export type RouteParams = {
  path?: string | string[];
  middleware?: Middleware[];
  applyHttpError?: boolean;
  handleResponse?: boolean;
  responseCode?: number;
};
