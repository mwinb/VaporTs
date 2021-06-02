import {
  Handler,
  Evaluator,
  HttpError,
  Curryware,
  docTsLogger,
  getRouteDoc,
  RequestField,
  VoidDecorator,
  ValidateConfig,
  getControllerDoc,
  isDocTsValidator,
  getConfiguredEvaluators,
  isJsonObjectEvaluator,
  DEFAULT_VALIDATE_CONFIG,
  createValidatorEvaluator,
  invalidRequestFieldMessage,
  invalidDocTsValidatorWarningMessage
} from '..';

const getValidationHandlerCurryware = (evaluator: Evaluator, requestFieldToValidate: string): Curryware => {
  return (ogMethod: Handler) => {
    return async function (...args: any[]) {
      const requestField = args[0][requestFieldToValidate];
      if (requestField !== undefined) {
        evaluator(requestField);
        return await ogMethod.apply(this, args);
      } else {
        docTsLogger.log(invalidRequestFieldMessage(requestFieldToValidate, ogMethod.name));
        throw new HttpError(501, 'Not implemented.');
      }
    };
  };
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

const getValidationEvaluator = (validator: Record<string, any>, validateConfig: ValidateConfig): Evaluator => {
  return getConfiguredEvaluators({
    ...validateConfig,
    evaluators: [getRouteEvaluator(validator, validateConfig.strip)]
  }).pop();
};

export const Validate = (
  validator: Record<string, any>,
  requestFieldToValidate: RequestField,
  validateConfig: ValidateConfig = {}
): VoidDecorator => {
  const config = { ...DEFAULT_VALIDATE_CONFIG, ...validateConfig };
  const evaluator = getValidationEvaluator(validator, config);
  return (target: Record<string, any>, propertyKey: string) => {
    const controllerDoc = getControllerDoc(target);
    const routeDoc = getRouteDoc(controllerDoc, propertyKey);
    controllerDoc.routes.set(propertyKey, {
      ...routeDoc,
      curriers: [getValidationHandlerCurryware(evaluator, requestFieldToValidate), ...routeDoc.curriers]
    });
  };
};
