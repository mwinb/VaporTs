import { Evaluator, ValidatorFieldConfig, getValidatorDoc, getArrayEvaluators } from '../..';

export const SetPropertyEvaluators = (
  evaluators: Evaluator[],
  validatorConfig: ValidatorFieldConfig
): PropertyDecorator => {
  return (target: any, propertyKey: string): void => {
    const validatorDoc = getValidatorDoc(target);
    const configuredEvaluators = validatorConfig.isArray ? getArrayEvaluators(validatorConfig, evaluators) : evaluators;
    validatorDoc.evaluators.set(propertyKey, configuredEvaluators);
  };
};
