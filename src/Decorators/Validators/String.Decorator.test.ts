import { isString } from '../..';
import { getValidatorDoc } from '../../Helpers/Validator.Helpers';
import { MockValidatorClass } from '../../__mocks__/ValidatorMocks';

describe('String', () => {
  it('Sets the field name and type in the validator class validatorDoc fieldMap', () => {
    const validatorClass = new MockValidatorClass();
    expect(getValidatorDoc(validatorClass).validators.get('stringField').pop()).toEqual(isString);
  });
});

describe('isString', () => {
  it('returns true if it is a string', () => {
    expect(isString('I am a string')).toBeTruthy();
  });

  it('returns false if it is not a string', () => {
    expect(isString(false)).toBeFalsy();
  });
});
