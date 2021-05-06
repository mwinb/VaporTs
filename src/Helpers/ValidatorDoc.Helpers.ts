import { ValidatorDoc, ValidatorFieldConfig } from '..';

export const getValidatorDoc = (target: Record<string, any>): ValidatorDoc => {
  if (!target.validatorDoc) {
    const validatorDoc: ValidatorDoc = {
      fieldValidators: new Map<string, ValidatorFieldConfig>()
    };
    target.validatorDoc = validatorDoc;
  }
  return target.validatorDoc;
};
