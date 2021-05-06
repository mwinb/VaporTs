import {
  ValidatorDoc,
  getValidatorDoc,
  isStringEvaluator,
  ValidatorFieldConfig,
  DEFAULT_VALIDATOR_FIELD_CONFIG
} from '..';

describe('Get Validator Doc', () => {
  it('creates a validator doc object if it does not exist on the object', () => {
    const validatorObject = {};
    getValidatorDoc(validatorObject);
    expect(validatorObject['validatorDoc']).toBeDefined();
  });

  it('returns an existing validator doc', async () => {
    const validatorObject: { validatorDoc: ValidatorDoc } = {
      validatorDoc: {
        fieldValidators: new Map<string, ValidatorFieldConfig>([
          ['field', { ...DEFAULT_VALIDATOR_FIELD_CONFIG, evaluators: [isStringEvaluator] }]
        ])
      }
    };
    const validatorDoc = getValidatorDoc(validatorObject);
    expect(validatorDoc.fieldValidators.get('field').evaluators).toEqual([isStringEvaluator]);
  });
});
