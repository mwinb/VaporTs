import { isArrayEvaluator, createArrayItemEvaluator, isBooleanEvaluator, Evaluator } from '..';

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
