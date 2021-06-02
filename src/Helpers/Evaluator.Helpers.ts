import { createArrayItemEvaluator, Evaluator, getEvaluatorsForIsArray, ValidatorFieldConfig } from '..';

export const getConfiguredEvaluators = ({
  isArray,
  evaluateEachItem,
  evaluators
}: ValidatorFieldConfig): Evaluator[] => {
  return isArray && evaluateEachItem
    ? [createArrayItemEvaluator(evaluators)]
    : getEvaluatorsForIsArray(isArray, evaluators);
};
