import {
  getValidatorEvaluator,
  isDocTsValidator,
  SetPropertyEvaluators,
  ValidatorFieldConfig,
  JsonObject,
  DocTsValidator
} from '../..';

export const EvaluateValidator = (
  validator: DocTsValidator,
  validatorConfig: ValidatorFieldConfig
): PropertyDecorator => {
  const evaluators = [getValidatorEvaluator(validator)];
  return SetPropertyEvaluators(evaluators, validatorConfig);
};

export const warnAndEvaluateJsonObject = (
  validatorDoc: Record<string, any>,
  validatorConfig: ValidatorFieldConfig
): PropertyDecorator => {
  console.log(
    `\nDocTs: ${validatorDoc} is not a valid DocTsValidator.\nField will be validated with isJsonObject validator\n`
  );
  return JsonObject(validatorConfig);
};

export const Validator = (
  validatorDoc: Record<string, any>,
  validatorConfig: ValidatorFieldConfig = { isArray: false, evaluateEachItem: true }
): PropertyDecorator => {
  return isDocTsValidator(validatorDoc)
    ? EvaluateValidator(validatorDoc, validatorConfig)
    : warnAndEvaluateJsonObject(validatorDoc, validatorConfig);
};
