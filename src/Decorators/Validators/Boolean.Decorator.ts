import { ValidateProperty } from './ValidatorProperty';

export const isBoolean = (arg: any): boolean => typeof arg === 'boolean';
export function Boolean() {
  return ValidateProperty([isBoolean]);
}
