import { getValidatorDoc, isArrayEvaluator, isJsonObjectEvaluator, Evaluator } from '../..';
import { MockValidatorClass, MockValidatorClassWithNonValidatorObject } from '../../__mocks__/ValidatorMocks';

describe('ValidatorObject', () => {
  let validatorClass: MockValidatorClass;
  let validatorFieldEvaluator: Evaluator;
  beforeEach(() => {
    validatorClass = new MockValidatorClass();
    validatorFieldEvaluator = getValidatorDoc(validatorClass).fieldValidators.get('validatorField').evaluators[0];
  });

  it('should use the isJsonObject validator if @ValidatorObject is called with a non VaporValidator', () => {
    expect(
      getValidatorDoc(new MockValidatorClassWithNonValidatorObject())
        .fieldValidators.get('nonValidatorField')
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

  it('Should strip extra unvalidated fields by default', () => {
    const objectToValidate = {
      stringField: 'string',
      booleanField: false,
      numberField: 10,
      subSubValidator: {
        stringField: 'string'
      },
      extraField: 'Remove Me'
    };
    validatorFieldEvaluator(objectToValidate);
    expect(objectToValidate['extraField']).toBeUndefined();
  });

  it('handles validator arrays by passing a ValidatorFieldConfig object', () => {
    expect(getValidatorDoc(validatorClass).fieldValidators.get('validatorArrayField').evaluators[0]).toEqual(
      isArrayEvaluator
    );
  });
});
