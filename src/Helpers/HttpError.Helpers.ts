import { Response } from 'express';
import { HttpError, Logger } from '..';

export const handleHttpError = (error: Error, res: Response): void => {
  if (error instanceof HttpError) {
    res.status(error.code).json({ code: error.code, message: error.message });
  } else {
    Logger.log(`\nDoc Ts: Uncaught Exception Error: ${error.message}\n${error.stack}\n`);
    res.status(500).json({ code: 500, message: 'Oops something went wrong.' });
  }
};
