import {
  Logger,
  JsonObject,
  DocTsValidator,
  isDocTsValidator,
  ValidatorFieldConfig,
  SetPropertyEvaluators,
  createValidatorEvaluator,
  DEFAULT_VALIDATOR_FIELD_CONFIG,
  invalidDocTsValidatorWarningMessage
} from '../..';

export const EvaluateValidator = (
  validator: DocTsValidator,
  validatorConfig: ValidatorFieldConfig
): PropertyDecorator => {
  return SetPropertyEvaluators({
    ...validatorConfig,
    evaluators: [createValidatorEvaluator(validator), ...validatorConfig.evaluators]
  });
};

export const warnAndEvaluateAsJsonObject = (
  validator: Record<string, any>,
  validatorConfig: ValidatorFieldConfig
): PropertyDecorator => {
  Logger.log(invalidDocTsValidatorWarningMessage(validator));
  return JsonObject(validatorConfig);
};

export const Validator = (
  validator: Record<string, any>,
  validationConfig: ValidatorFieldConfig = {}
): PropertyDecorator => {
  const config = { ...DEFAULT_VALIDATOR_FIELD_CONFIG, ...validationConfig };
  return isDocTsValidator(validator)
    ? EvaluateValidator(validator, config)
    : warnAndEvaluateAsJsonObject(validator, config);
};
