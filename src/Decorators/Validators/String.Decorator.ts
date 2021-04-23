import { ValidateProperty } from './ValidatorProperty';

export const isString = (arg: any) => typeof arg === 'string';
export function String() {
  return ValidateProperty([isString]);
}
