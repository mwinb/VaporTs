import {
  Logger,
  JsonObject,
  DocTsValidator,
  isDocTsValidator,
  ValidatorFieldConfig,
  getValidatorEvaluator,
  SetPropertyEvaluators,
  invalidDocTsValidatorWarning
} from '../..';
import { DEFAULT_VALIDATOR_FIELD_CONFIG } from '../../Interfaces/ValidatorDoc.Interface';

export const EvaluateValidator = (
  validator: DocTsValidator,
  validatorConfig: ValidatorFieldConfig
): PropertyDecorator => {
  return SetPropertyEvaluators({
    ...validatorConfig,
    evaluators: [getValidatorEvaluator(validator), ...validatorConfig.evaluators]
  });
};

export const warnAndEvaluateJsonObject = (
  validatorDoc: Record<string, any>,
  validatorConfig: ValidatorFieldConfig
): PropertyDecorator => {
  Logger.log(invalidDocTsValidatorWarning(validatorDoc));
  return JsonObject(validatorConfig);
};

export const Validator = (
  validatorDoc: Record<string, any>,
  validationConfig: ValidatorFieldConfig = {}
): PropertyDecorator => {
  const config = { ...DEFAULT_VALIDATOR_FIELD_CONFIG, ...validationConfig };
  return isDocTsValidator(validatorDoc)
    ? EvaluateValidator(validatorDoc, config)
    : warnAndEvaluateJsonObject(validatorDoc, config);
};
