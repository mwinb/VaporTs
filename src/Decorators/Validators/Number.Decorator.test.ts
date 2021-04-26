import { getValidatorDoc, isNumberValidator } from '../..';
import { isArrayValidator } from '../../Helpers/Validator.Helpers';
import { MockValidatorClass } from '../../__mocks__/ValidatorMocks';

describe('Number', () => {
  const validatorClass = new MockValidatorClass();
  it('sets the properties validators.', () => {
    expect(getValidatorDoc(validatorClass).validators.get('numberField')).toBeDefined();
  });

  it('gets array validator fns if passing a ValidatorConfig with isArray set to true', () => {
    expect(getValidatorDoc(validatorClass).validators.get('numberArrayField').shift()).toEqual(isArrayValidator);
  });
});

describe('isBooleanValidator', () => {
  it('returns true if it is a boolean', () => {
    expect(isNumberValidator(10)).toBeTruthy();
  });

  it('returns false if it is not a boolean', () => {
    expect(isNumberValidator('string')).toBeFalsy();
  });
});
