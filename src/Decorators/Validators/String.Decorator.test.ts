import { getValidatorDoc, isArrayEvaluator, isStringEvaluator } from '../..';
import { MockValidatorClass } from '../../__mocks__/ValidatorMocks';

describe('String', () => {
  const validatorClass = new MockValidatorClass();
  it('Sets the field name and type in the validator class validatorDoc fieldMap', () => {
    expect(getValidatorDoc(validatorClass).evaluators.get('stringField').pop()).toEqual(isStringEvaluator);
  });

  it('handles string arrays by passing a ValidatorFieldConfig object', () => {
    expect(getValidatorDoc(validatorClass).evaluators.get('stringArrayField').shift()).toEqual(isArrayEvaluator);
  });
});
