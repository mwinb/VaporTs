import { ValidatorFieldConfig, Evaluator } from '..';

export const isArrayEvaluator = (object: unknown): object is Array<any> => {
  return Array.isArray(object);
};

export const createArrayItemEvaluator = (evaluators: Evaluator[]): Evaluator => {
  return (itemArray: any): boolean => {
    return isArrayEvaluator(itemArray) && itemArray.every(obj => evaluators.every(evaluator => evaluator(obj)));
  };
};

export const getEvaluatorsForIsArray = (isArray: boolean, evaluators: Evaluator[]): Evaluator[] => {
  return isArray ? [isArrayEvaluator] : evaluators;
};

export const getEvaluatorsForValidatorFieldConfig = (
  { isArray, evaluateEachItem }: ValidatorFieldConfig,
  validators: Evaluator[]
): Evaluator[] => {
  return isArray && evaluateEachItem
    ? [createArrayItemEvaluator(validators)]
    : getEvaluatorsForIsArray(isArray, validators);
};

export const getArrayEvaluators = (validatorConfig: ValidatorFieldConfig, evaluators: Evaluator[]): Evaluator[] => {
  return getEvaluatorsForValidatorFieldConfig(validatorConfig, evaluators);
};
