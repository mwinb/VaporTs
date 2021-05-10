import { Response } from 'express';

const handleResponse = (code: number, res: Response, result: any): void => {
  result !== undefined ? res.status(code).send(result) : res.sendStatus(code);
};

export const applyResponseHandler = (code: number, descriptor: PropertyDescriptor): PropertyDescriptor => {
  const ogMethod = descriptor.value;
  descriptor.value = async function (...args: any[]) {
    const res: Response = args[1];
    const result = await ogMethod.apply(this, args);
    !res.headersSent && handleResponse(code, res, result);
    return result;
  };
  return descriptor;
};

export const ResponseHandler = (code = 200) => {
  return (_target: Record<string, any>, _propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
    return applyResponseHandler(code, descriptor);
  };
};
