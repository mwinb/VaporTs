import { isStringValidator } from '../..';
import { getValidatorDoc, isArrayValidator } from '../../Helpers/Validator.Helpers';
import { MockValidatorClass } from '../../__mocks__/ValidatorMocks';

describe('String', () => {
  const validatorClass = new MockValidatorClass();
  it('Sets the field name and type in the validator class validatorDoc fieldMap', () => {
    expect(getValidatorDoc(validatorClass).validators.get('stringField').pop()).toEqual(isStringValidator);
  });

  it('handles string arrays by passing a ValidatorConfig object', () => {
    expect(getValidatorDoc(validatorClass).validators.get('stringArrayField').shift()).toEqual(isArrayValidator);
  });
});

describe('isStringValidator', () => {
  it('returns true if it is a string', () => {
    expect(isStringValidator('I am a string')).toBeTruthy();
  });

  it('returns false if it is not a string', () => {
    expect(isStringValidator(false)).toBeFalsy();
  });
});
