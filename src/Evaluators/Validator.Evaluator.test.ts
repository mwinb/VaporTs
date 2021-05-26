import {
  MockValidatorClass,
  MockValidatorWithSubValidator,
  MockSubValidatorWithOptionalSubValidator
} from '../__mocks__/ValidatorMocks';
import { createValidatorEvaluator, Evaluator, isStringEvaluator } from '..';
describe('Get Validator Evaluator', () => {
  it('returns an evaluator for a DocTsValidator', () => {
    expect(typeof createValidatorEvaluator(new MockValidatorClass() as any, true) === 'function').toBeTruthy();
  });

  describe('ValidatorEvaluator - non optional fields', () => {
    let validatorEvaluator: Evaluator;
    beforeEach(() => {
      validatorEvaluator = createValidatorEvaluator(new MockValidatorWithSubValidator() as any, true);
    });
    it('returns true if the provided object passes all field evaluators', () => {
      expect(
        validatorEvaluator({
          stringField: 'string',
          subValidator: {
            stringField: 'string'
          }
        })
      ).toBeTruthy();
    });

    it('throws an error if it fails to validate a field', () => {
      let thrownError;
      try {
        validatorEvaluator({
          stringField: 'string'
        });
      } catch (error) {
        thrownError = error;
      }
      expect(thrownError).toBeDefined();
      expect(thrownError.message).toBe(
        `subValidator is a required field in ${JSON.stringify({ stringField: 'string' }, null, 2)}`
      );
    });
  });

  describe('ValidatorEvaulator - with optional fields', () => {
    let validatorEvaluator: Evaluator;
    beforeEach(() => {
      validatorEvaluator = createValidatorEvaluator(new MockSubValidatorWithOptionalSubValidator() as any, true);
    });

    it('ignores optional fields if they are not provided', () => {
      expect(
        validatorEvaluator({
          stringField: 'string',
          booleanField: false,
          numberField: 10
        })
      ).toBeTruthy();
    });

    it('throws an HttpError if it fails to validate a field.', () => {
      let thrownError;
      try {
        validatorEvaluator({
          stringField: 'string',
          booleanField: false,
          numberField: 10,
          optionalSubSubValidator: {
            stringField: 100
          }
        });
      } catch (error) {
        thrownError = error;
      }
      expect(thrownError).toBeDefined();
      expect(thrownError.code).toBe(400);
      expect(thrownError.message).toBe(
        `stringField failed ${isStringEvaluator.name} in ${JSON.stringify({ stringField: 100 }, null, 2)}`
      );
    });
  });
});
