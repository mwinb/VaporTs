import {
  Handler,
  Evaluator,
  HttpError,
  Curryware,
  vaporLogger,
  getRouteDoc,
  RequestField,
  VoidDecorator,
  ValidateConfig,
  getControllerDoc,
  isVaporValidator,
  getConfiguredEvaluators,
  isJsonObjectEvaluator,
  DEFAULT_VALIDATE_CONFIG,
  createValidatorEvaluator,
  invalidRequestFieldMessage,
  invalidValidatorWarningMessage
} from '..';

const getValidationHandlerCurryware = (evaluator: Evaluator, requestFieldToValidate: string): Curryware => {
  return (ogMethod: Handler) => {
    return async function (...args: any[]) {
      const requestField = args[0][requestFieldToValidate];
      if (requestField !== undefined) {
        evaluator(requestField);
        return await ogMethod.apply(this, args);
      } else {
        vaporLogger.log(invalidRequestFieldMessage(requestFieldToValidate, ogMethod.name));
        throw new HttpError(501, 'Not implemented.');
      }
    };
  };
};

const warnAndReturnJsonEvaluator = (validator: Record<string, any>): Evaluator => {
  vaporLogger.log(invalidValidatorWarningMessage(validator));
  return isJsonObjectEvaluator;
};

const getRouteEvaluator = (validator: Record<string, any>, strip: boolean): Evaluator => {
  return isVaporValidator(validator)
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
