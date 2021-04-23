import { ValidateProperty } from './ValidatorProperty';

export const isNumber = (arg: any): boolean => typeof arg === 'number';
export function Number() {
  return ValidateProperty([isNumber]);
}
