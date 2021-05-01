import { ValidatorFieldConfig, getValidatorDoc, getArrayEvaluators } from '../..';

export const SetPropertyEvaluators = (validatorConfig: ValidatorFieldConfig): PropertyDecorator => {
  return (target: any, propertyKey: string): void => {
    const validatorDoc = getValidatorDoc(target);
    const configuredEvaluators = validatorConfig.isArray
      ? getArrayEvaluators(validatorConfig)
      : validatorConfig.evaluators;
    validatorDoc.fieldValidators.set(propertyKey, { ...validatorConfig, evaluators: configuredEvaluators });
  };
};
