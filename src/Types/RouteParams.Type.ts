import { Middleware } from './Middleware.Type';

export type RouteParams = {
  path?: string | string[];
  middleware?: Middleware[];
  handleErrors?: boolean;
  handleResponse?: boolean;
  responseCode?: number;
};
