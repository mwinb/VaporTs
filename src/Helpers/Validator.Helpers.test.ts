import { getValidatorDoc } from '..';
import { ValidatorDoc } from '../Interfaces/Validator';
import { ValidatorFn } from '../Types/Validator';

describe('Get Validator Doc', () => {
  it('creates a validator doc object if it does not exist on the object', () => {
    const validatorObject = {};
    getValidatorDoc(validatorObject);
    expect(validatorObject['validatorDoc']).toBeDefined();
  });

  it('returns an existing validator doc', async () => {
    const validatorObject: { validatorDoc: ValidatorDoc } = {
      validatorDoc: {
        validators: new Map<string, ValidatorFn[]>([['field', []]])
      }
    };
    const validatorDoc = getValidatorDoc(validatorObject);
    expect(validatorDoc.validators.get('field')).toEqual([]);
  });
});
