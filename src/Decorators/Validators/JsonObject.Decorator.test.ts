import { MockValidatorClass } from '../../__mocks__/ValidatorMocks';
import { getValidatorDoc, isArrayEvaluator, isJsonObjectEvaluator } from '../..';

describe('JsonObject', () => {
  const validatorClass = new MockValidatorClass();
  it('Sets the field name and type in the validator class validatorDoc fieldMap', () => {
    expect(getValidatorDoc(validatorClass).fieldValidators.get('objectField').evaluators.pop()).toEqual(
      isJsonObjectEvaluator
    );
  });

  it('handles string arrays by passing a ValidatorFieldConfig object', () => {
    expect(getValidatorDoc(validatorClass).fieldValidators.get('objectArrayField').evaluators.shift()).toEqual(
      isArrayEvaluator
    );
  });
});
