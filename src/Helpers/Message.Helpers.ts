import { Evaluator } from '..';

export const invalidValidatorWarningMessage = (validator: Record<string, any>): string => {
  return `${validator} is not a valid Validator.\nField will be validated with isJsonObject validator\n`;
};

export const requiredFieldWarningMessage = (key: string, object: Record<string, any>): string => {
  return `${key} is a required field in ${JSON.stringify(object, null, 2)}`;
};

export const failedEvaluatorMessage = (evaluator: Evaluator, object: Record<string, any>, key: string): string => {
  return `${key} failed ${evaluator.name} in ${JSON.stringify(object, null, 2)}`;
};

export const invalidRequestFieldMessage = (requestFieldToValidate: string, functionName: string): string => {
  return `Invalid request field ${requestFieldToValidate} in Validate @ ${functionName}. \n`;
};

export const uncaughtExceptionMessage = (error: Error): string => {
  return `Uncaught Exception Error: ${error.message}\n${error.stack}\n`;
};

export const initializeControllersMessage = (path?: string): string => {
  return `Initializing ${path || '/'} controllers.`;
};

export const invalidControllerMessage = (controller: Record<string, any>): string => {
  return `${controller} is not a valid Controller. Ensure that it is decorated with @Controller.`;
};

export const invalidVapeRouter = (missingMethod: string) => {
  return `Invalid VapeRouter provided in RouterConfig. Required method ${missingMethod} is required.`
}

export const bindingRouteMessage = (
  controllerName: string,
  controllerMethod: string,
  routeVerb: string,
  fullPath: string
): string => {
  return `Binding ${controllerName}.${controllerMethod} to ${routeVerb} @ ${fullPath}`;
};
