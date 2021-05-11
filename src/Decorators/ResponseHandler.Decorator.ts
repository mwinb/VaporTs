import { Response } from 'express';
import { Middleware } from '../Types/Middleware.Type';

const handleResponse = (code: number, res: Response, result: any): void => {
  result !== undefined ? res.status(code).send(result) : res.sendStatus(code);
};

export const genereateResponseHandler = (code: number, originalFunction: (...args: any[]) => any): Middleware => {
  return async function (...args: any[]) {
    const res: Response = args[1];
    const result = await originalFunction.apply(this, args);
    !res.headersSent && handleResponse(code, res, result);
    return result;
  };
};

export const applyResponseHandler = (code: number, descriptor: PropertyDescriptor): PropertyDescriptor => {
  descriptor.value = genereateResponseHandler(code, descriptor.value);
  return descriptor;
};

export const ResponseHandler = (code = 200) => {
  return (_target: Record<string, any>, _propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
    return applyResponseHandler(code, descriptor);
  };
};
