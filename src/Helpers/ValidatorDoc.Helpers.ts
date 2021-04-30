import { ValidatorDoc, Evaluator, DocTsValidator, FieldValidator } from '..';
import { HttpError } from '../Classes/HttpError';

export const isNumberEvaluator = (arg: unknown): boolean => typeof arg === 'number';
export const isStringEvaluator = (arg: unknown): boolean => typeof arg === 'string';
export const isBooleanEvaluator = (arg: unknown): boolean => typeof arg === 'boolean';
export const isJsonObjectEvaluator = (arg: unknown): boolean => typeof arg === 'object';
export const isDocTsValidator = (object: Record<string, any>): object is DocTsValidator =>
  'validatorDoc' in Object.getPrototypeOf(object);
export const invalidDocTsValidatorWarning = (validator: Record<string, any>): string => {
  return `\nDocTs: ${validator} is not a valid DocTsValidator.\nField will be validated with isJsonObject validator\n`;
};

export const getValidatorDoc = (target: Record<string, any>): ValidatorDoc => {
  if (!target.validatorDoc) {
    const validatorDoc: ValidatorDoc = {
      fieldValidators: new Map<string, FieldValidator>()
    };
    target.validatorDoc = validatorDoc;
  }
  return target.validatorDoc;
};

export const getValidatorEvaluator = (arg: DocTsValidator): Evaluator => {
  const validatorDoc = getValidatorDoc(arg);
  return (object: Record<string, any>) => {
    return Array.from(validatorDoc.fieldValidators.entries()).every(([key, evaluator]) => {
      const hasField = object[key] !== undefined;
      const evaluateField = () =>
        evaluator.evaluators.every(evaluator => {
          const passes = evaluator(object[key]);
          if (!passes)
            throw new HttpError(400, `${key} failed ${evaluator.name} in ${JSON.stringify(object, null, 2)}`);
          return passes;
        });
      const handleOptionalFalse = () => {
        if (!hasField) throw new HttpError(400, `${key} is a required field in ${JSON.stringify(object, null, 2)}`);
        return evaluateField();
      };
      const handleOptionalTrue = () => (hasField ? evaluateField() : true);
      return evaluator.config.optional ? handleOptionalTrue() : handleOptionalFalse();
    });
  };
};
