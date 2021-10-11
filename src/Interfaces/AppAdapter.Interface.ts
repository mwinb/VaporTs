export interface AppAdapterInterface {
  get: Function;
  put: Function;
  all: Function;
  use: Function;
  post: Function;
  head: Function;
  patch: Function;
  delete: Function;
  listen: Function;
}
