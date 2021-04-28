import { ValidatorFieldConfig, SetPropertyEvaluators, isStringEvaluator } from '../..';

export const String = (
  validationConfig: ValidatorFieldConfig = { isArray: false, evaluateEachItem: true }
): PropertyDecorator => {
  const evaluators = [isStringEvaluator];
  return SetPropertyEvaluators(evaluators, validationConfig);
};
