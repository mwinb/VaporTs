import { isBooleanEvaluator, SetPropertyEvaluators, ValidatorFieldConfig, DEFAULT_VALIDATOR_FIELD_CONFIG } from '../..';

export const Boolean = (validationConfig: ValidatorFieldConfig = {}): PropertyDecorator => {
  const config = { ...DEFAULT_VALIDATOR_FIELD_CONFIG, ...validationConfig };
  const evaluators = [isBooleanEvaluator];
  return SetPropertyEvaluators(evaluators, config);
};
