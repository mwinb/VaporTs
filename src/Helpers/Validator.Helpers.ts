import { ValidatorDoc } from '..';
import { ValidatorFn } from '../Types/Validator';

export const getValidatorDoc = (target: Record<string, any>): ValidatorDoc => {
  if (!target.validatorDoc) {
    const validatorDoc: ValidatorDoc = {
      validators: new Map<string, ValidatorFn[]>()
    };
    target.validatorDoc = validatorDoc;
  }
  return target.validatorDoc;
};
