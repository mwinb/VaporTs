import { ValidatorFieldConfig, SetPropertyEvaluators, isStringEvaluator, DEFAULT_VALIDATOR_FIELD_CONFIG } from '../..';

export const String = (validationConfig: ValidatorFieldConfig = {}): PropertyDecorator => {
  const config = { ...DEFAULT_VALIDATOR_FIELD_CONFIG, ...validationConfig };
  return SetPropertyEvaluators({ ...config, evaluators: [isStringEvaluator, ...config.evaluators] });
};
