import {
  MockValidatorClass,
  MockValidatorWithSubValidator,
  MockSubValidatorWithOptionalSubValidator
} from '../__mocks__/ValidatorMocks';
import { createValidatorEvaluatorFromReqField, Evaluator, isStringEvaluator } from '..';
describe('Get Validator Evaluator', () => {
  it('returns an evaluator for a VaporValidator', () => {
    expect(
      typeof createValidatorEvaluatorFromReqField(new MockValidatorClass() as any, true) === 'function'
    ).toBeTruthy();
  });

  describe('ValidatorEvaluator - non optional fields', () => {
    let validatorEvaluator: Evaluator;
    beforeEach(() => {
      validatorEvaluator = createValidatorEvaluatorFromReqField(new MockValidatorWithSubValidator() as any, true);
    });
    it('returns true if the provided object passes all field evaluators', () => {
      expect(
        validatorEvaluator({
          req: {
            body: {
              stringField: 'string',
              subValidator: {
                stringField: 'string'
              }
            }
          },
          field: 'body'
        })
      ).toBeTruthy();
    });

    it('throws an error if it fails to validate a field', () => {
      let thrownError;
      try {
        validatorEvaluator({
          req: {
            body: {
              stringField: 'string'
            }
          },
          field: 'body'
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
      validatorEvaluator = createValidatorEvaluatorFromReqField(
        new MockSubValidatorWithOptionalSubValidator() as any,
        true
      );
    });

    it('ignores optional fields if they are not provided', () => {
      expect(
        validatorEvaluator({
          req: {
            body: {
              stringField: 'string',
              booleanField: false,
              numberField: 10
            }
          },
          field: 'body'
        })
      ).toBeTruthy();
    });

    it('throws an HttpError if it fails to validate a field.', () => {
      let thrownError;
      try {
        validatorEvaluator({
          req: {
            body: {
              stringField: 'string',
              booleanField: false,
              numberField: 10,
              optionalSubSubValidator: {
                stringField: 100
              }
            }
          },
          field: 'body'
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
