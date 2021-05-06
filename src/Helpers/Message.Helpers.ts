import { Evaluator } from '../Types/Evaluator.Type';

export const invalidDocTsValidatorWarningMessage = (validator: Record<string, any>): string => {
  return `\nDocTs: ${validator} is not a valid DocTsValidator.\nField will be validated with isJsonObject validator\n`;
};

export const requiredFieldWarningMessage = (key: string, object: Record<string, any>): string => {
  return `${key} is a required field in ${JSON.stringify(object, null, 2)}`;
};

export const failedEvaluatorMessage = (evaluator: Evaluator, object: Record<string, any>, key: string): string => {
  return `${key} failed ${evaluator.name} in ${JSON.stringify(object, null, 2)}`;
};

export const invalidRequestFieldMessage = (requestFieldToValidate: string, functionName: string): string => {
  return `\nDocTs: Invalid request field ${requestFieldToValidate} in Validate @ ${functionName}. \n`;
};

export const uncaughtExceptionMessage = (error: Error): string => {
  return `\nDoc Ts: Uncaught Exception Error: ${error.message}\n${error.stack}\n`;
};
