import {
  Evaluator,
  ValidatorDoc,
  getValidatorDoc,
  isDocTsValidator,
  isNumberEvaluator,
  isStringEvaluator,
  isBooleanEvaluator,
  isJsonObjectEvaluator
} from '..';
import { MockValidatorClass } from '../__mocks__/ValidatorMocks';

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
        evaluators: new Map<string, Evaluator[]>([['field', [isStringEvaluator]]])
      }
    };
    const validatorDoc = getValidatorDoc(validatorObject);
    expect(validatorDoc.evaluators.get('field')).toEqual([isStringEvaluator]);
  });
});
