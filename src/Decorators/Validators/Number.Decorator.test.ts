import { getValidatorDoc, isNumber } from '../..';
import { MockValidatorClass } from '../../__mocks__/ValidatorMocks';

describe('Number', () => {
  it('sets the properties validators.', () => {
    const validatorClass = new MockValidatorClass();
    expect(getValidatorDoc(validatorClass).validators.get('numberField')).toBeDefined();
  });
});

describe('isBoolean', () => {
  it('returns true if it is a boolean', () => {
    expect(isNumber(10)).toBeTruthy();
  });

  it('returns false if it is not a boolean', () => {
    expect(isNumber('string')).toBeFalsy();
  });
});
