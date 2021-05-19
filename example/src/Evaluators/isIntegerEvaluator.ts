import { HttpError } from '../../../src';

export const stringIsInteger = (arg: any) => {
  if (!Number.isInteger(+arg)) {
    throw new HttpError(400, `Field must cast to Integer.`);
  }
  return true;
};
