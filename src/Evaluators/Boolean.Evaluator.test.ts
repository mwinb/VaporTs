import { isBooleanEvaluator } from '..';
describe('isBooleanEvaluator', () => {
  it('returns true if it is a boolean', () => {
    expect(isBooleanEvaluator(true)).toBeTruthy();
  });

  it('returns false if it is not a boolean', () => {
    expect(isBooleanEvaluator('string')).toBeFalsy();
  });
});
