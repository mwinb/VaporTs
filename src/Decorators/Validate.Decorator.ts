import {
  Logger,
  Evaluator,
  HttpError,
  RequestField,
  handleHttpError,
  isDocTsValidator,
  getValidatorEvaluator,
  isJsonObjectEvaluator,
  PropertyDescriptorDecorator,
  invalidDocTsValidatorWarning
} from '..';

const getEvaluatorMethodOverride = (
  evaluator: Evaluator,
  ogMethod: Function,
  requestFieldToValidate: string
): ((...args: any[]) => Promise<void>) => {
  return async function (...args: any[]) {
    const requestField = args[0][requestFieldToValidate];
    const response = args[1];
    try {
      if (requestField !== undefined) {
        evaluator(requestField);
        await ogMethod.apply(this, args);
      } else {
        Logger.log(`\nDocTs: Invalid request field ${requestFieldToValidate} in Validate @ ${ogMethod.name}. \n`);
        throw new HttpError(501, 'Not implemented.');
      }
    } catch (error) {
      handleHttpError(error, response);
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
  Logger.log(invalidDocTsValidatorWarning(validator));
  return isJsonObjectEvaluator;
};

const getRouteEvaluator = (validator: Record<string, any>): Evaluator => {
  return isDocTsValidator(validator) ? getValidatorEvaluator(validator) : warnAndReturnJsonEvaluator(validator);
};

export const Validate = (
  validator: Record<string, any>,
  requestFieldToValidate: RequestField
): PropertyDescriptorDecorator => {
  const evaluator = getRouteEvaluator(validator);
  return (_target: Record<string, any>, _propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
    return applyEvaluator(evaluator, descriptor, requestFieldToValidate);
  };
};
