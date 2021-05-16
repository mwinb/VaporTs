import { satIdEvaluator } from './satIdEvaluator';
describe('satIdEvaluator', () => {
  it('returns true if the id parses to an Int', () => {
    expect(satIdEvaluator('1000')).toBeTruthy();
  });

  it('throws an HttpError if the sat id provided does not parse to an int', () => {
    let errorThrown;
    try {
      satIdEvaluator('I am not a number.');
    } catch (error) {
      errorThrown = error;
    }
    expect(errorThrown.code).toBe(400);
  });
});
