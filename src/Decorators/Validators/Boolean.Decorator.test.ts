import { MockValidatorClass } from '../../__mocks__/ValidatorMocks';
import { getValidatorDoc, isArrayEvaluator, isBooleanEvaluator } from '../..';

describe('Boolean', () => {
  const validatorClass = new MockValidatorClass();
  it('Sets the validator map key to the property name and adds the isBoolean Evaluator', () => {
    expect(getValidatorDoc(validatorClass).fieldValidators.get('booleanField').evaluators.pop()).toEqual(
      isBooleanEvaluator
    );
  });

  it('handles boolean arrays by passing a ValidatorFieldConfig object', () => {
    expect(getValidatorDoc(validatorClass).fieldValidators.get('booleanArrayField').evaluators.shift()).toEqual(
      isArrayEvaluator
    );
  });
});
