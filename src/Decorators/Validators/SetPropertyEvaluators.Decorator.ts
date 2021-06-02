import { ValidatorFieldConfig, getValidatorDoc, getConfiguredEvaluators } from '../..';

export const SetPropertyEvaluators = (validatorConfig: ValidatorFieldConfig): PropertyDecorator => {
  return (target: any, propertyKey: string): void => {
    const validatorDoc = getValidatorDoc(target);
    validatorDoc.fieldValidators.set(propertyKey, {
      ...validatorConfig,
      evaluators: getConfiguredEvaluators(validatorConfig)
    });
  };
};
