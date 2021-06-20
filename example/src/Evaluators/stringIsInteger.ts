import { HttpError } from '../../../src';

export const stringIsInteger = (arg: any): boolean => {
  if (!Number.isInteger(+arg)) {
    throw new HttpError(400, `Invalid value: ${arg}. Must cast to Integer.`);
  }
  return true;
};
