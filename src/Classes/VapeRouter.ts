import { ExpressLikeApp, invalidVapeRouter, VapeRouterInterface } from "..";

const vapeRouterRequiredMethods = new Set([
  'get',
  'put',
  'post',
  'patch',
  'delete',
  'all',
  'use',
  'head',
  'listen',
]);

export class VapeRouter implements VapeRouterInterface {
  _get: Function;
  _put: Function;
  _patch: Function;
  _post: Function;
  _delete: Function;
  _all: Function;
  _head: Function;
  _use: Function;
  _listen: Function;

  constructor(app: ExpressLikeApp) {
    vapeRouterRequiredMethods.forEach(methodName => {
      if(methodName in app) {
        this['_' + methodName] = function (...args: any[]) { app[methodName](...args) };
      } else {
        throw new Error(invalidVapeRouter(methodName))
      }
    })
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

