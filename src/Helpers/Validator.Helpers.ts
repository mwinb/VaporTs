import { ValidatorDoc } from '..';
import { ValidatorConfig } from '../Interfaces/Validator';
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

export const isArrayValidator = (object: any): object is Array<any> => {
  return Array.isArray(object);
};

export const createArrayItemValidator = (validatorFns: ValidatorFn[]): ValidatorFn => {
  return (object: any): boolean => {
    let passesValidation = true;
    if (isArrayValidator(object)) {
      try {
        object.forEach(obj => {
          validatorFns.forEach((fn: ValidatorFn) => {
            console.log(obj);
            if (!fn(obj)) throw new Error('Failed Validation');
          });
        });
      } catch {
        passesValidation = false;
      }
    } else {
      passesValidation = false;
    }
    return passesValidation;
  };
};

export const getArrayValidators = (
  { isArray = false, validateArrayItems = false }: ValidatorConfig,
  validatorFns: ValidatorFn[]
) => {
  let newValidatorArray = [];
  if (validateArrayItems && isArray) {
    newValidatorArray.push(createArrayItemValidator(validatorFns));
  } else if (isArray) {
    newValidatorArray.unshift(isArrayValidator);
  } else {
    newValidatorArray = validatorFns;
  }
  return newValidatorArray;
};
