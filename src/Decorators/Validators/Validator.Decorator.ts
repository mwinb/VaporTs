import {
  JsonObject,
  docTsLogger,
  DocTsValidator,
  ValidatorConfig,
  isDocTsValidator,
  ValidatorFieldConfig,
  SetPropertyEvaluators,
  createValidatorEvaluator,
  DEFAULT_VALIDATOR_FIELD_CONFIG,
  invalidDocTsValidatorWarningMessage
} from '../..';

export const EvaluateValidator = (
  validator: DocTsValidator,
  validatorConfig: ValidatorFieldConfig,
  strip: boolean
): PropertyDecorator => {
  return SetPropertyEvaluators({
    ...validatorConfig,
    evaluators: [createValidatorEvaluator(validator, strip), ...validatorConfig.evaluators]
  });
};

export const warnAndEvaluateAsJsonObject = (
  validator: Record<string, any>,
  validatorConfig: ValidatorFieldConfig
): PropertyDecorator => {
  docTsLogger.log(invalidDocTsValidatorWarningMessage(validator));
  return JsonObject(validatorConfig);
};

export const Validator = (validator: Record<string, any>, validatorConfig: ValidatorConfig = {}): PropertyDecorator => {
  const config = { ...DEFAULT_VALIDATOR_FIELD_CONFIG, ...validatorConfig };
  return isDocTsValidator(validator)
    ? EvaluateValidator(validator, config, config.strip)
    : warnAndEvaluateAsJsonObject(validator, config);
};
