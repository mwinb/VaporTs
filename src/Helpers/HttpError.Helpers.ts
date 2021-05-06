import { Response } from 'express';
import { HttpError, Logger, uncaughtExceptionMessage } from '..';

export const handleHttpError = (error: Error, res: Response): void => {
  if (error instanceof HttpError) {
    res.status(error.code).json({ code: error.code, message: error.message });
  } else {
    Logger.log(uncaughtExceptionMessage(error));
    res.status(500).json({ code: 500, message: 'Oops something went wrong.' });
  }
};
