import { handleHttpError } from '..';

export function HttpErrorHandler(
  _target: Record<string, any>,
  _propertyKey: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const originalMethod = descriptor.value;
  descriptor.value = async function (...args: any[]) {
    try {
      await originalMethod.apply(this, args);
    } catch (err) {
      handleHttpError(err, args[1]);
    }
  };
  return descriptor;
}
