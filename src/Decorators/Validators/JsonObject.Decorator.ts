import {
  ValidatorFieldConfig,
  isJsonObjectEvaluator,
  SetPropertyEvaluators,
  DEFAULT_VALIDATOR_FIELD_CONFIG
} from '../..';

export const JsonObject = (validationConfig: ValidatorFieldConfig = {}): PropertyDecorator => {
  const config = { ...DEFAULT_VALIDATOR_FIELD_CONFIG, ...validationConfig };
  const evaluators = [isJsonObjectEvaluator];
  return SetPropertyEvaluators(evaluators, config);
};
