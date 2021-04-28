import { ValidatorDoc, Evaluator, DocTsValidator } from '..';

export const isNumberEvaluator = (arg: unknown): boolean => typeof arg === 'number';
export const isStringEvaluator = (arg: unknown): boolean => typeof arg === 'string';
export const isBooleanEvaluator = (arg: unknown): boolean => typeof arg === 'boolean';
export const isJsonObjectEvaluator = (arg: unknown): boolean => typeof arg === 'object';
export const isDocTsValidator = (object: Record<string, any>): object is DocTsValidator =>
  'validatorDoc' in Object.getPrototypeOf(object);

export const getValidatorDoc = (target: Record<string, any>): ValidatorDoc => {
  if (!target.validatorDoc) {
    const validatorDoc: ValidatorDoc = {
      evaluators: new Map<string, Evaluator[]>()
    };
    target.validatorDoc = validatorDoc;
  }
  return target.validatorDoc;
};

export const getValidatorEvaluator = (arg: DocTsValidator): Evaluator => {
  const validatorDoc = getValidatorDoc(arg);
  return (object: Record<string, any>) =>
    Object.keys(object).every(key => {
      const evaluators = validatorDoc.evaluators.get(key);
      return evaluators && evaluators.every(evaluator => evaluator(object[key]));
    });
};
