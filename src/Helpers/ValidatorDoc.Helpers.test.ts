import {
  Evaluator,
  ValidatorDoc,
  FieldValidator,
  getValidatorDoc,
  isDocTsValidator,
  isNumberEvaluator,
  isStringEvaluator,
  isBooleanEvaluator,
  isJsonObjectEvaluator,
  DEFAULT_VALIDATOR_FIELD_CONFIG
} from '..';
import {
  MockValidatorClass,
  MockValidatorWithSubValidator,
  MockSubValidatorWithOptionalSubValidator
} from '../__mocks__/ValidatorMocks';
import { getValidatorEvaluator } from './ValidatorDoc.Helpers';

describe('isBooleanEvaluator', () => {
  it('returns true if it is a boolean', () => {
    expect(isBooleanEvaluator(true)).toBeTruthy();
  });

  it('returns false if it is not a boolean', () => {
    expect(isBooleanEvaluator('string')).toBeFalsy();
  });
});

describe('isNumberEvaluator', () => {
  it('returns true if it is a number', () => {
    expect(isNumberEvaluator(10)).toBeTruthy();
  });

  it('returns false if it is not a number', () => {
    expect(isNumberEvaluator('string')).toBeFalsy();
  });
});

describe('isStringEvaluator', () => {
  it('returns true if it is a string', () => {
    expect(isStringEvaluator('I am a string')).toBeTruthy();
  });

  it('returns false if it is not a string', () => {
    expect(isStringEvaluator(false)).toBeFalsy();
  });
});

describe('isObjectEvaluator', () => {
  it('returns true if it receives an object', () => {
    expect(isJsonObjectEvaluator({ someField: 'string' })).toBeTruthy();
  });

  it('returns false if it is not an object', () => {
    expect(isJsonObjectEvaluator('something')).toBeFalsy();
  });
});

describe('objectIsDocTsEvaluator', () => {
  it('returns true if object has validatorDoc on prototype', () => {
    expect(isDocTsValidator(new MockValidatorClass()));
  });

  it('returns false if it does not have validatorDoc on prototype', () => {
    expect(isDocTsValidator({})).toBeFalsy();
  });
});

describe('Get Validator Doc', () => {
  it('creates a validator doc object if it does not exist on the object', () => {
    const validatorObject = {};
    getValidatorDoc(validatorObject);
    expect(validatorObject['validatorDoc']).toBeDefined();
  });

  it('returns an existing validator doc', async () => {
    const validatorObject: { validatorDoc: ValidatorDoc } = {
      validatorDoc: {
        fieldValidators: new Map<string, FieldValidator>([
          ['field', { evaluators: [isStringEvaluator], config: DEFAULT_VALIDATOR_FIELD_CONFIG }]
        ])
      }
    };
    const validatorDoc = getValidatorDoc(validatorObject);
    expect(validatorDoc.fieldValidators.get('field').evaluators).toEqual([isStringEvaluator]);
  });
});

describe('Get Validator Evaluator', () => {
  it('returns an evaluator for a DocTsValidator', () => {
    expect(typeof getValidatorEvaluator(new MockValidatorClass() as any) === 'function').toBeTruthy();
  });

  describe('ValidatorEvaluator - non optional fields', () => {
    let validatorEvaluator: Evaluator;
    beforeEach(() => {
      validatorEvaluator = getValidatorEvaluator(new MockValidatorWithSubValidator() as any);
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
        console.log(error);
        thrownError = error;
      }
      expect(thrownError).toBeDefined();
      expect(thrownError.message).toBe(
        `subValidator is a required field in ${JSON.stringify(
          {
            stringField: 'string'
          },
          null,
          2
        )}`
      );
    });
  });

  describe('ValidatorEvaulator - with optional fields', () => {
    let validatorEvaluator: Evaluator;
    beforeEach(() => {
      validatorEvaluator = getValidatorEvaluator(new MockSubValidatorWithOptionalSubValidator() as any);
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
