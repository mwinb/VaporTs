import { isJsonObjectEvaluator } from '..';

describe('isObjectEvaluator', () => {
  it('returns true if it receives an object', () => {
    expect(isJsonObjectEvaluator({ someField: 'string' })).toBeTruthy();
  });

  it('returns false if it is not an object', () => {
    expect(isJsonObjectEvaluator('something')).toBeFalsy();
  });
});
