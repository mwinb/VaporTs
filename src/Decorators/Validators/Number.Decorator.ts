import { getArrayValidators } from '../../Helpers/Validator.Helpers';
import { ValidatorConfig } from '../../Interfaces/Validator';
import { ValidateProperty } from './ValidatorProperty';

export const isNumberValidator = (arg: any): boolean => typeof arg === 'number';
export function Number(validatorConfig: ValidatorConfig = { isArray: false, validateArrayItems: true }) {
  const numberValidators = [isNumberValidator];
  const validatorFns = validatorConfig.isArray
    ? getArrayValidators(validatorConfig, numberValidators)
    : numberValidators;
  return ValidateProperty(validatorFns);
}
