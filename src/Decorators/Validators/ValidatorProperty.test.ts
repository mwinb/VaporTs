import { getValidatorDoc } from '../..';
import { MockValidatorClass } from '../../__mocks__/ValidatorMocks';
import { isString } from './String.Decorator';

describe('ValidatorProperty', () => {
  const mockValidatorClass = new MockValidatorClass();

  it('adds the provided validators to the validatorDoc.properties', () => {
    expect(getValidatorDoc(mockValidatorClass).validators.get('validatorProperty').pop()).toEqual(isString);
  });
});
