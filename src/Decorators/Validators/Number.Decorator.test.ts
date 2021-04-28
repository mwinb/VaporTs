import { getValidatorDoc, isArrayEvaluator } from '../..';
import { MockValidatorClass } from '../../__mocks__/ValidatorMocks';

describe('Number', () => {
  const validatorClass = new MockValidatorClass();
  it('sets the properties validators.', () => {
    expect(getValidatorDoc(validatorClass).evaluators.get('numberField')).toBeDefined();
  });

  it('handles number arrays by passing a ValidatorFieldConfig object', () => {
    expect(getValidatorDoc(validatorClass).evaluators.get('numberArrayField').shift()).toEqual(isArrayEvaluator);
  });
});
