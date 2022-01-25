import {
  JsonObject,
  vaporLogger,
  VaporValidator,
  ValidatorConfig,
  isVaporValidator,
  ValidatorFieldConfig,
  SetPropertyEvaluators,
  DEFAULT_VALIDATOR_FIELD_CONFIG,
  invalidValidatorWarningMessage,
  createValidatorEvaluatorFromReqField
} from '../..';

export const EvaluateValidator = (
  validator: VaporValidator,
  validatorConfig: ValidatorFieldConfig,
  strip: boolean
): PropertyDecorator => {
  return SetPropertyEvaluators({
    ...validatorConfig,
    evaluators: [createValidatorEvaluatorFromReqField(validator, strip), ...validatorConfig.evaluators]
  });
};

export const warnAndEvaluateAsJsonObject = (
  validator: Record<string, any>,
  validatorConfig: ValidatorFieldConfig
): PropertyDecorator => {
  vaporLogger.log(invalidValidatorWarningMessage(validator));
  return JsonObject(validatorConfig);
};

export const Validator = (validator: Record<string, any>, validatorConfig: ValidatorConfig = {}): PropertyDecorator => {
  const config = { ...DEFAULT_VALIDATOR_FIELD_CONFIG, ...validatorConfig };
  return isVaporValidator(validator)
    ? EvaluateValidator(validator, config, config.strip)
    : warnAndEvaluateAsJsonObject(validator, config);
};
