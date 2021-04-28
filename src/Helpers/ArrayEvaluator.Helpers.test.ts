import { isArrayEvaluator, createArrayItemEvaluator, isBooleanEvaluator, getArrayEvaluators, Evaluator } from '..';

describe('isArrayEvaluator', () => {
  it('returns true if the item passed is an array', () => {
    expect(isArrayEvaluator(['something'])).toBeTruthy();
  });

  it('returns false if the item pass is not an array', () => {
    expect(isArrayEvaluator('string')).toBeFalsy();
  });
});

describe('createArrayItemEvaluator', () => {
  let arrayItemEvaluator: Evaluator;
  it('returns a new evaluator function given an array of evaluators', () => {
    expect(typeof createArrayItemEvaluator([]) === 'function').toBeTruthy();
  });

  it('returns a evaluator that returns false if provided object is not an array', () => {
    arrayItemEvaluator = createArrayItemEvaluator([]);
    expect(arrayItemEvaluator('not an array')).toBeFalsy();
  });

  it('returns a function that returns true if the object passed is an array and all items pass validation', () => {
    arrayItemEvaluator = createArrayItemEvaluator([isBooleanEvaluator]);
    expect(arrayItemEvaluator([true, true, true, false])).toBeTruthy();
  });

  it('returns a function that returns false if any of the items do not pass a validator fn', () => {
    arrayItemEvaluator = createArrayItemEvaluator([isBooleanEvaluator]);
    expect(arrayItemEvaluator([true, true, 'fail'])).toBeFalsy();
  });
});

describe('getArrayEvaluators', () => {
  it('puts the isArrayEvaluator function at the front of the provided evaluator functions list if isArray is set to true and evaluateArrayItems is set to false', () => {
    const evaluators = getArrayEvaluators({ isArray: true }, [jest.fn()]);
    expect(evaluators.shift()).toEqual(isArrayEvaluator);
  });

  it('returns the given validatorFns if both validateArrayItems and isArray are false', () => {
    const evaluators = getArrayEvaluators({}, [() => true]);
    expect(evaluators.shift()('anything')).toBeTruthy();
  });

  it('replaces all validatorFns with created arrayItemValidator if isArray and validateArrayItems is set to true', () => {
    const mockEvaluator = jest.fn();
    const evaluators = getArrayEvaluators({ isArray: true, evaluateEachItem: true }, [mockEvaluator]);
    expect(evaluators.length).toEqual(1);
  });
});
