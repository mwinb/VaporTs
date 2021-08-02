import { VaporValidator } from '..';

export const isVaporValidator = (object: Record<string, any>): object is VaporValidator =>
  'validatorDoc' in Object.getPrototypeOf(object);
