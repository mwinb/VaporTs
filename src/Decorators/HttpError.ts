import { Response } from 'express';

export class HttpError extends Error {
  constructor(public code: number, public message: string) {
    super(message);
  }
}

export const handleHttpError = (error: Error, res: Response): void => {
  if (error instanceof HttpError) {
    res.status(error.code).json({ code: error.code, message: error.message });
  } else {
    res.status(500).json({ code: 500, message: 'Oops something went wrong.' });
  }
};

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
