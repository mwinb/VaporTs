import { Evaluator } from '../../Types/Evaluator.Type';
import { getValidatorDoc, isArrayEvaluator, isJsonObjectEvaluator } from '../..';
import { MockValidatorClass, MockValidatorClassWithNonValidatorObject } from '../../__mocks__/ValidatorMocks';

describe('ValidatorObject', () => {
  let validatorClass: MockValidatorClass;
  let validatorFieldEvaluator: Evaluator;
  beforeEach(() => {
    validatorClass = new MockValidatorClass();
    validatorFieldEvaluator = getValidatorDoc(validatorClass).fieldValidators.get('validatorField').evaluators[0];
  });

  it('should use the isJsonObject validator if @ValidatorObject is called with a non DocTsValidator', () => {
    expect(
      getValidatorDoc(new MockValidatorClassWithNonValidatorObject())
        .fieldValidators.get('nonDocTsValidatorField')
        .evaluators.pop()
    ).toEqual(isJsonObjectEvaluator);
  });
  it('Sets the validator map key to the property name and adds the ValidatorEvaluator', () => {
    expect(
      validatorFieldEvaluator({
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
    expect(getValidatorDoc(validatorClass).fieldValidators.get('validatorArrayField').evaluators[0]).toEqual(
      isArrayEvaluator
    );
  });
});
