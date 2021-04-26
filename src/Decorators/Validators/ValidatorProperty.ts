import { getValidatorDoc } from '../..';
import { Validator } from '../../Classes/Validator';
import { ValidatorFn } from '../../Types/Validator';

export function ValidateProperty(validators: ValidatorFn[]) {
  return (target: any, propertyKey: string): void => {
    if (!(target instanceof Validator)) throw new Error('DocTs: Can only be used with objects that extend Validator');
    const meta = getValidatorDoc(target);
    meta.validators.set(propertyKey, validators);
  };
}
