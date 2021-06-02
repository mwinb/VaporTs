import { Response } from 'express';
import { HttpError, docTsLogger, uncaughtExceptionMessage, Handler } from '..';

export const handleHttpError = (error: Error, res: Response): void => {
  if (res.headersSent) return;
  if (error instanceof HttpError) {
    res.status(error.code).send({ code: error.code, message: error.message });
  } else {
    docTsLogger.log(uncaughtExceptionMessage(error));
    res.status(500).send({ code: 500, message: 'Oops something went wrong.' });
  }
};

export const curryHttpErrorHandler = (originalMethod: Handler): Handler => {
  return async function (...args: any[]): Promise<any> {
    const res = args[1];
    try {
      return await originalMethod.apply(this, args);
    } catch (err) {
      handleHttpError(err, res);
    }
  };
};
