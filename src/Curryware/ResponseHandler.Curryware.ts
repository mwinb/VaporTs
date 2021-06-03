import { Response } from 'express';
import { Handler, Curryware } from '..';

const handleResponse = (code: number, res: Response, result: any): void => {
  result !== undefined ? res.status(code).send(result) : res.sendStatus(code);
};

const curryResponseHandler = (code: number, originalFunction: Handler): Handler => {
  return async function (...args: any[]) {
    const res: Response = args[1];
    const result = await originalFunction.apply(this, args);
    !res.headersSent && handleResponse(code, res, result);
    return result;
  };
};

export const getResponseHandlerCurryware = (code: number): Curryware => {
  return function (originalFunction: Handler): Handler {
    return curryResponseHandler(code, originalFunction);
  };
};
