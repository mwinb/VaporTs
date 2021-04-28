import { isNumberEvaluator, SetPropertyEvaluators, ValidatorFieldConfig } from '../..';

export const Number = (
  validatorConfig: ValidatorFieldConfig = { isArray: false, evaluateEachItem: true }
): PropertyDecorator => {
  const evaluators = [isNumberEvaluator];
  return SetPropertyEvaluators(evaluators, validatorConfig);
};
