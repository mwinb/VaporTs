import { Middleware } from '..';

export interface RouteParams {
  path?: string | string[];
  middleware?: Middleware[];
  handleErrors?: boolean;
  handleResponse?: boolean;
  responseCode?: number;
}

export const DEFAULT_ROUTE_PARAMS: RouteParams = {
  path: '',
  middleware: [],
  handleErrors: true,
  handleResponse: true,
  responseCode: 200
};
