import { getValidatorDoc, isStringEvaluator } from '../..';
import { MockValidatorClass } from '../../__mocks__/ValidatorMocks';

describe('ValidatorProperty', () => {
  const mockValidatorClass = new MockValidatorClass();

  it('adds the provided evaluators to the validatorDoc.properties', () => {
    console.log(mockValidatorClass);
    expect(getValidatorDoc(mockValidatorClass).evaluators.get('validatorProperty').pop()).toEqual(isStringEvaluator);
  });
});
