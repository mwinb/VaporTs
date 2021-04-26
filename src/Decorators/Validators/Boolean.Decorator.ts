import { getArrayValidators } from '../../Helpers/Validator.Helpers';
import { ValidatorConfig } from '../../Interfaces/Validator';
import { ValidateProperty } from './ValidatorProperty';

export const isBooleanValidator = (arg: any): boolean => typeof arg === 'boolean';
export function Boolean(validatorConfig: ValidatorConfig = { isArray: false, validateArrayItems: true }) {
  const booleanValidators = [isBooleanValidator];
  const validatorFns = validatorConfig.isArray
    ? getArrayValidators(validatorConfig, booleanValidators)
    : booleanValidators;
  return ValidateProperty(validatorFns);
}
