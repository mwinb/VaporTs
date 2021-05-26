import {
  Evaluator,
  HttpError,
  Generator,
  docTsLogger,
  getRouteDoc,
  RequestField,
  VoidDecorator,
  ValidateConfig,
  getControllerDoc,
  isDocTsValidator,
  getArrayEvaluators,
  isJsonObjectEvaluator,
  DEFAULT_VALIDATE_CONFIG,
  createValidatorEvaluator,
  invalidRequestFieldMessage,
  invalidDocTsValidatorWarningMessage
} from '..';

export const generateValidatorHandler = (evaluator: Evaluator, requestFieldToValidate: string): Generator => {
  return (ogMethod: any) => {
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

const getValidatorHandlerGenerator = (evaluator: Evaluator, requestField: RequestField): Generator => {
  return generateValidatorHandler(evaluator, requestField);
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
): VoidDecorator => {
  const config = { ...DEFAULT_VALIDATE_CONFIG, ...validateConfig };
  const evaluator = getValidateEvaluator(validator, config);
  return (target: Record<string, any>, propertyKey: string) => {
    const controllerDoc = getControllerDoc(target);
    const routeDoc = getRouteDoc(controllerDoc, propertyKey);
    controllerDoc.routes.set(propertyKey, {
      ...routeDoc,
      generators: [getValidatorHandlerGenerator(evaluator, requestFieldToValidate), ...routeDoc.generators]
    });
  };
};
