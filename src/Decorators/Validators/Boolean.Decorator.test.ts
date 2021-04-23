import { getValidatorDoc, isBoolean } from '../..';
import { MockValidatorClass } from '../../__mocks__/ValidatorMocks';

describe('Boolean', () => {
  it('Sets the validator map key to the property name and adds the isBoolean ValidatorFn', () => {
    const validatorClass = new MockValidatorClass();
    expect(getValidatorDoc(validatorClass).validators.get('booleanField').pop()).toEqual(isBoolean);
  });
});

describe('isBoolean', () => {
  it('returns true if it is a boolean', () => {
    expect(isBoolean(true)).toBeTruthy();
  });

  it('returns false if it is not a boolean', () => {
    expect(isBoolean('string')).toBeFalsy();
  });
});
