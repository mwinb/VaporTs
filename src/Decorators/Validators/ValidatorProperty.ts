import { getValidatorDoc } from '../..';
import { ValidatorFn } from '../../Types/Validator';

export function ValidateProperty(validators: ValidatorFn[]) {
  return (target: Record<string, any>, propertyKey: string): void => {
    const meta = getValidatorDoc(target);
    meta.validators.set(propertyKey, validators);
  };
}
