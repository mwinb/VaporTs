import { getValidatorDoc, isArrayEvaluator, isJsonObjectEvaluator } from '../..';
import { MockValidatorClass } from '../../__mocks__/ValidatorMocks';

describe('JsonObject', () => {
  const validatorClass = new MockValidatorClass();
  it('Sets the field name and type in the validator class validatorDoc fieldMap', () => {
    expect(getValidatorDoc(validatorClass).evaluators.get('objectField').pop()).toEqual(isJsonObjectEvaluator);
  });

  it('handles string arrays by passing a ValidatorFieldConfig object', () => {
    expect(getValidatorDoc(validatorClass).evaluators.get('objectArrayField').shift()).toEqual(isArrayEvaluator);
  });
});
