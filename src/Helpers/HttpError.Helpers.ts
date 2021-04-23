import { Response } from 'express';
import { HttpError } from '..';

export const handleHttpError = (error: Error, res: Response): void => {
  if (error instanceof HttpError) {
    res.status(error.code).json({ code: error.code, message: error.message });
  } else {
    res.status(500).json({ code: 500, message: 'Oops something went wrong.' });
  }
};
