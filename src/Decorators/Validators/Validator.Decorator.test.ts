import { getValidatorDoc, isArrayEvaluator } from '../..';
import { isJsonObjectEvaluator } from '../../Helpers/ValidatorDoc.Helpers';
import { MockValidatorClass, MockValidatorClassWithNonValidatorObject } from '../../__mocks__/ValidatorMocks';

describe('ValidatorObject', () => {
  const validatorClass = new MockValidatorClass();

  it('should use the isJsonObject validator if @ValidatorObject is called with a non DocTsValidator', () => {
    expect(
      getValidatorDoc(new MockValidatorClassWithNonValidatorObject()).evaluators.get('nonDocTsValidatorField').pop()
    ).toEqual(isJsonObjectEvaluator);
  });
  it('Sets the validator map key to the property name and adds the isValidator Evaluator', () => {
    expect(
      getValidatorDoc(validatorClass).evaluators.get('validatorField').pop()({
        stringField: 'string',
        booleanField: false,
        numberField: 10,
        subSubValidator: {
          stringField: 'string'
        }
      })
    ).toBeTruthy();
  });

  it('handles validator arrays by passing a ValidatorFieldConfig object', () => {
    expect(getValidatorDoc(validatorClass).evaluators.get('validatorArrayField').shift()).toEqual(isArrayEvaluator);
  });
});
