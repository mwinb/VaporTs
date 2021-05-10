import { handleHttpError } from '..';

export const applyHttpErrorHandler = (descriptor: PropertyDescriptor): PropertyDescriptor => {
  const originalMethod = descriptor.value;
  descriptor.value = async function (...args: any[]) {
    try {
      return await originalMethod.apply(this, args);
    } catch (err) {
      return handleHttpError(err, args[1]);
    }
  };
  return descriptor;
};

export const HttpErrorHandler = () => {
  return (_target: Record<string, any>, _propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
    return applyHttpErrorHandler(descriptor);
  };
};
