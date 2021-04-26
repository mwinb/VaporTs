import { getArrayValidators } from '../../Helpers/Validator.Helpers';
import { ValidatorConfig } from '../../Interfaces/Validator';
import { ValidateProperty } from './ValidatorProperty';

export const isStringValidator = (arg: any) => typeof arg === 'string';
export function String(validationConfig: ValidatorConfig = { isArray: false, validateArrayItems: true }) {
  const stringValidators = [isStringValidator];
  const validatorFns = validationConfig.isArray
    ? getArrayValidators(validationConfig, stringValidators)
    : stringValidators;
  return ValidateProperty(validatorFns);
}
