import { DocTsValidator } from '..';

export const isDocTsValidator = (object: Record<string, any>): object is DocTsValidator =>
  'validatorDoc' in Object.getPrototypeOf(object);
