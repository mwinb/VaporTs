import { isStringEvaluator } from '..';
describe('isStringEvaluator', () => {
  it('returns true if it is a string', () => {
    expect(isStringEvaluator('I am a string')).toBeTruthy();
  });

  it('returns false if it is not a string', () => {
    expect(isStringEvaluator(false)).toBeFalsy();
  });
});
