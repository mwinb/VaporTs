export interface VapeRouterInterface {
  get: Function;
  put: Function;
  post: Function;
  patch: Function;
  delete: Function;
  all: Function;
  use: Function;
  head: Function;
  listen: Function;
}