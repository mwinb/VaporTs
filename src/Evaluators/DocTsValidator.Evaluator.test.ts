import { isDocTsValidator } from '..';
import { MockValidatorClass } from '../__mocks__/ValidatorMocks';

describe('objectIsDocTsEvaluator', () => {
  it('returns true if object has validatorDoc on prototype', () => {
    expect(isDocTsValidator(new MockValidatorClass()));
  });

  it('returns false if it does not have validatorDoc on prototype', () => {
    expect(isDocTsValidator({})).toBeFalsy();
  });
});
