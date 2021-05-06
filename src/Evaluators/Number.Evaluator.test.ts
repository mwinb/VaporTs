import { isNumberEvaluator } from '..';
describe('isNumberEvaluator', () => {
  it('returns true if it is a number', () => {
    expect(isNumberEvaluator(10)).toBeTruthy();
  });

  it('returns false if it is not a number', () => {
    expect(isNumberEvaluator('string')).toBeFalsy();
  });
});
