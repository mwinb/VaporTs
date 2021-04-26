import { getValidatorDoc, isBooleanValidator } from '../..';
import { isArrayValidator } from '../../Helpers/Validator.Helpers';
import { MockValidatorClass } from '../../__mocks__/ValidatorMocks';

describe('Boolean', () => {
  const validatorClass = new MockValidatorClass();
  it('Sets the validator map key to the property name and adds the isBoolean ValidatorFn', () => {
    expect(getValidatorDoc(validatorClass).validators.get('booleanField').pop()).toEqual(isBooleanValidator);
  });

  it('handles array validation if the isArray config property is set to true in params', () => {
    expect(getValidatorDoc(validatorClass).validators.get('booleanArrayField').shift()).toEqual(isArrayValidator);
  });
});

describe('isBooleanValidator', () => {
  it('returns true if it is a boolean', () => {
    expect(isBooleanValidator(true)).toBeTruthy();
  });

  it('returns false if it is not a boolean', () => {
    expect(isBooleanValidator('string')).toBeFalsy();
  });
});
