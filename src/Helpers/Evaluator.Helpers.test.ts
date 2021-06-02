import { getConfiguredEvaluators, isArrayEvaluator } from '..';

describe('Get Configured Evaluators', () => {
  it('puts the isArrayEvaluator function at the front of the provided evaluator functions list if isArray is set to true and evaluateArrayItems is set to false', () => {
    const evaluators = getConfiguredEvaluators({ isArray: true, evaluators: [jest.fn()] });
    expect(evaluators.shift()).toEqual(isArrayEvaluator);
  });

  it('replaces all validatorFns with created arrayItemValidator if it should evaluate each item', () => {
    const mockEvaluator = jest.fn();
    const evaluators = getConfiguredEvaluators({ isArray: true, evaluateEachItem: true, evaluators: [mockEvaluator] });
    expect(evaluators.length).toEqual(1);
  });

  it('returns the original evaluators if it is not an array', () => {
    const mockEvaluator = jest.fn();
    const evaluators = getConfiguredEvaluators({ isArray: false, evaluators: [mockEvaluator] });
    expect(evaluators).toEqual([mockEvaluator]);
  });
});
