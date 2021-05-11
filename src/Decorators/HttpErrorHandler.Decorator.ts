import { handleHttpError } from '..';
import { Middleware } from '../Types/Middleware.Type';

export const generateHttpErrorHandler = (originalMethod: (...args: any[]) => any): Middleware => {
  return async function (...args: any[]): Promise<any> {
    try {
      return await originalMethod.apply(this, args);
    } catch (err) {
      handleHttpError(err, args[1]);
    }
  };
};

export const applyHttpErrorHandler = (descriptor: PropertyDescriptor): PropertyDescriptor => {
  descriptor.value = generateHttpErrorHandler(descriptor.value);
  return descriptor;
};

export const HttpErrorHandler = () => {
  return (_target: Record<string, any>, _propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
    return applyHttpErrorHandler(descriptor);
  };
};
