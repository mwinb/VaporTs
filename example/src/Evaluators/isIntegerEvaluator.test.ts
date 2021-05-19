import { stringIsInteger } from './isIntegerEvaluator';
describe('satIdEvaluator', () => {
  it('returns true if the string parses to an Integer', () => {
    expect(stringIsInteger('1000')).toBeTruthy();
  });

  it('throws an HttpError if the parsed string provided isNaN', () => {
    let errorThrown;
    try {
      stringIsInteger('I am not a number.');
    } catch (error) {
      errorThrown = error;
    }
    expect(errorThrown.code).toBe(400);
  });
  it('throws an HttpError if the parsed string provided does not parse to an Integer', () => {
    let errorThrown;
    try {
      console.log(Number.isInteger(+'40.4'));
      stringIsInteger('40.4');
    } catch (error) {
      errorThrown = error;
    }
    expect(errorThrown.code).toBe(400);
  });
});
