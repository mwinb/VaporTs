import { MockValidatorClass } from '../../__mocks__/ValidatorMocks';
import { getValidatorDoc, isArrayEvaluator, isStringEvaluator } from '../..';

describe('String', () => {
  const validatorClass = new MockValidatorClass();
  it('Sets the field name and type in the validator class validatorDoc fieldMap', () => {
    expect(getValidatorDoc(validatorClass).fieldValidators.get('stringField').evaluators.pop()).toEqual(
      isStringEvaluator
    );
  });

  it('handles string arrays by passing a ValidatorFieldConfig object', () => {
    expect(getValidatorDoc(validatorClass).fieldValidators.get('stringArrayField').evaluators.shift()).toEqual(
      isArrayEvaluator
    );
  });
});
