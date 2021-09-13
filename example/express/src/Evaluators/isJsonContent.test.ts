import { isJsonContent } from './isJsonContent';

describe('isApplicationJsonEvaluator', () => {
  it('throws an HttpError with a status code of 400 if the provided arg does not contain application/json mime type', () => {
    let httpError;
    try {
      isJsonContent('text/html');
    } catch (error) {
      httpError = error;
    }
    expect(httpError.code).toBe(400);
  });

  it('returns true if the string contains application/json mime type', () => {
    expect(isJsonContent('application/json')).toBeTruthy();
  });
});
