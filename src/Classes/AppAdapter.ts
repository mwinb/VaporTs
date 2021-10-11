import { ExpressLikeApp, invalidVapeRouter, AppAdapterInterface } from '..';

const adaptedMethods = new Set(['get', 'put', 'post', 'patch', 'delete', 'all', 'use', 'head', 'listen']);

export class AppAdapter implements AppAdapterInterface {
  private _get: Function;
  private _put: Function;
  private _all: Function;
  private _use: Function;
  private _post: Function;
  private _head: Function;
  private _patch: Function;
  private _delete: Function;
  private _listen: Function;

  constructor(public app: ExpressLikeApp) {
    this.mapMethods();
  }

  private mapMethods() {
    adaptedMethods.forEach(methodName => {
      if (methodName in this.app) {
        this['_' + methodName] = this.app[methodName].bind(this.app);
      } else {
        throw new Error(invalidVapeRouter(methodName));
      }
    });
  }

  get get() {
    return this._get;
  }

  get put() {
    return this._put;
  }

  get patch() {
    return this._patch;
  }

  get post() {
    return this._post;
  }

  get delete() {
    return this._delete;
  }

  get all() {
    return this._all;
  }

  get head() {
    return this._head;
  }

  get use() {
    return this._use;
  }

  get listen() {
    return this._listen;
  }
}
