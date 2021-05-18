import { Response } from 'express';
import { Middleware, Generator } from '..';

const handleResponse = (code: number, res: Response, result: any): void => {
  result !== undefined ? res.status(code).send(result) : res.sendStatus(code);
};

const generateResponseHandler = (code: number, originalFunction: (...args: any[]) => any): Middleware => {
  return async function (...args: any[]) {
    const res: Response = args[1];
    const result = await originalFunction.apply(this, args);
    !res.headersSent && handleResponse(code, res, result);
    return result;
  };
};

export const getResponseHandlerGenerator = (code: number): Generator => {
  return function (originalFunction: (...args: any[]) => any): Middleware {
    return generateResponseHandler(code, originalFunction);
  };
};
