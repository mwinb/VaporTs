import { HttpError } from '../../../src';

export const satIdEvaluator = (arg: any) => {
  if (isNaN(parseInt(arg))) {
    throw new HttpError(400, `Satellite id must be a valid Integer.`);
  }
  return true;
};
