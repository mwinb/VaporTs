import {
  Evaluator,
  HttpError,
  docTsLogger,
  RequestField,
  ValidateConfig,
  handleHttpError,
  isDocTsValidator,
  getArrayEvaluators,
  isJsonObjectEvaluator,
  DEFAULT_VALIDATE_CONFIG,
  createValidatorEvaluator,
  invalidRequestFieldMessage,
  PropertyDescriptorDecorator,
  invalidDocTsValidatorWarningMessage
} from '..';

const getEvaluatorMethodOverride = (
  evaluator: Evaluator,
  ogMethod: (...args: any[]) => void | Promise<void>,
  requestFieldToValidate: string
): ((...args: any[]) => Promise<void>) => {
  return async function (...args: any[]) {
    const requestField = args[0][requestFieldToValidate];
    const response = args[1];
    try {
      if (requestField !== undefined) {
        evaluator(requestField);
        return await ogMethod.apply(this, args);
      } else {
        docTsLogger.log(invalidRequestFieldMessage(requestFieldToValidate, ogMethod.name));
        throw new HttpError(501, 'Not implemented.');
      }
    } catch (error) {
      return handleHttpError(error, response);
    }
  };
};

const applyEvaluator = (
  evaluator: Evaluator,
  propertyDescriptor: PropertyDescriptor,
  requestField: RequestField
): PropertyDescriptor => {
  const ogMethod = propertyDescriptor.value;
  propertyDescriptor.value = getEvaluatorMethodOverride(evaluator, ogMethod, requestField);
  return propertyDescriptor;
};

const warnAndReturnJsonEvaluator = (validator: Record<string, any>): Evaluator => {
  docTsLogger.log(invalidDocTsValidatorWarningMessage(validator));
  return isJsonObjectEvaluator;
};

const getRouteEvaluator = (validator: Record<string, any>, strip: boolean): Evaluator => {
  return isDocTsValidator(validator)
    ? createValidatorEvaluator(validator, strip)
    : warnAndReturnJsonEvaluator(validator);
};

const getValidateEvaluator = (validator: Record<string, any>, validateConfig: ValidateConfig): Evaluator => {
  return getArrayEvaluators({
    ...validateConfig,
    evaluators: [getRouteEvaluator(validator, validateConfig.strip)]
  }).pop();
};

export const Validate = (
  validator: Record<string, any>,
  requestFieldToValidate: RequestField,
  validateConfig: ValidateConfig = {}
): PropertyDescriptorDecorator => {
  const config = { ...DEFAULT_VALIDATE_CONFIG, ...validateConfig };
  const evaluator = getValidateEvaluator(validator, config);
  return (_target: Record<string, any>, _propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
    return applyEvaluator(evaluator, descriptor, requestFieldToValidate);
  };
};
