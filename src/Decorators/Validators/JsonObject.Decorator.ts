import { ValidatorFieldConfig, isJsonObjectEvaluator, SetPropertyEvaluators } from '../..';

export const JsonObject = (
  validationConfig: ValidatorFieldConfig = { isArray: false, evaluateEachItem: true }
): PropertyDecorator => {
  const evaluators = [isJsonObjectEvaluator];
  return SetPropertyEvaluators(evaluators, validationConfig);
};
