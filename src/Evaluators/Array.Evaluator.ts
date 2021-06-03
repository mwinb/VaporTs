import { Evaluator } from '..';

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
