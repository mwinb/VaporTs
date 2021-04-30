import { getValidatorDoc, isStringEvaluator } from '../..';
import { MockValidatorClass } from '../../__mocks__/ValidatorMocks';

describe('ValidatorProperty', () => {
  const mockValidatorClass = new MockValidatorClass();

  it('adds the provided evaluators to the validatorDoc.properties', () => {
    expect(getValidatorDoc(mockValidatorClass).fieldValidators.get('validatorProperty').evaluators.pop()).toEqual(
      isStringEvaluator
    );
  });
});
