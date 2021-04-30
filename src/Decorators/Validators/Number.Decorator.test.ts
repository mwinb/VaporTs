import { getValidatorDoc, isArrayEvaluator } from '../..';
import { MockValidatorClass } from '../../__mocks__/ValidatorMocks';

describe('Number', () => {
  const validatorClass = new MockValidatorClass();
  it('sets the properties validators.', () => {
    expect(getValidatorDoc(validatorClass).fieldValidators.get('numberField')).toBeDefined();
  });

  it('handles number arrays by passing a ValidatorFieldConfig object', () => {
    expect(getValidatorDoc(validatorClass).fieldValidators.get('numberArrayField').evaluators.shift()).toEqual(
      isArrayEvaluator
    );
  });
});
