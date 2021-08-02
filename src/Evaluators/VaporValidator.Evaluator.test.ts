import { isVaporValidator } from '..';
import { MockValidatorClass } from '../__mocks__/ValidatorMocks';

describe('objectIsVaporValidator', () => {
  it('returns true if object has validatorDoc on prototype', () => {
    expect(isVaporValidator(new MockValidatorClass()));
  });

  it('returns false if it does not have validatorDoc on prototype', () => {
    expect(isVaporValidator({})).toBeFalsy();
  });
});
