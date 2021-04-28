import { isBooleanEvaluator, SetPropertyEvaluators, ValidatorFieldConfig } from '../..';

export const Boolean = (
  validatorConfig: ValidatorFieldConfig = { isArray: false, evaluateEachItem: true }
): PropertyDecorator => {
  const evaluators = [isBooleanEvaluator];
  return SetPropertyEvaluators(evaluators, validatorConfig);
};
