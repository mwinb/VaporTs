import { getValidatorDoc, isArrayEvaluator, isBooleanEvaluator } from '../..';
import { MockValidatorClass } from '../../__mocks__/ValidatorMocks';

describe('Boolean', () => {
  const validatorClass = new MockValidatorClass();
  it('Sets the validator map key to the property name and adds the isBoolean Evaluator', () => {
    expect(getValidatorDoc(validatorClass).evaluators.get('booleanField').pop()).toEqual(isBooleanEvaluator);
  });

  it('handles boolean arrays by passing a ValidatorFieldConfig object', () => {
    expect(getValidatorDoc(validatorClass).evaluators.get('booleanArrayField').shift()).toEqual(isArrayEvaluator);
  });
});
