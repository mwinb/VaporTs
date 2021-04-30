import { isNumberEvaluator, SetPropertyEvaluators, ValidatorFieldConfig, DEFAULT_VALIDATOR_FIELD_CONFIG } from '../..';

export const Number = (validationConfig: ValidatorFieldConfig = {}): PropertyDecorator => {
  const config = { ...DEFAULT_VALIDATOR_FIELD_CONFIG, ...validationConfig };
  const evaluators = [isNumberEvaluator];
  return SetPropertyEvaluators(evaluators, config);
};
