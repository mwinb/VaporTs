import { getValidatorDoc } from '..';
import { isBooleanValidator } from '../Decorators/Validators/Boolean.Decorator';
import { ValidatorDoc } from '../Interfaces/Validator';
import { ValidatorFn } from '../Types/Validator';
import { createArrayItemValidator, getArrayValidators, isArrayValidator } from './Validator.Helpers';

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

describe('isArrayValidator', () => {
  it('returns true if the item passed is an array', () => {
    expect(isArrayValidator(['something'])).toBeTruthy();
  });

  it('returns false if the item pass is not an array', () => {
    expect(isArrayValidator('string')).toBeFalsy();
  });
});

describe('createArrayItemValidator', () => {
  it('returns a new validator function given an array of validators', () => {
    expect(typeof createArrayItemValidator([]) === 'function').toBeTruthy();
  });

  it('returns a validator that returns false if provided object is not an array', () => {
    const arrayItemValidator = createArrayItemValidator([]);
    expect(arrayItemValidator('not an array')).toBeFalsy();
  });

  it('returns a function that returns true if the object passed is an array and all items pass validation', () => {
    const arrayItemValidator = createArrayItemValidator([isBooleanValidator]);
    expect(arrayItemValidator([true, true, true, false])).toBeTruthy();
  });

  it('returns a function that returns false if any of the items do not pass a validator fn', () => {
    const arrayItemValidator = createArrayItemValidator([isBooleanValidator]);
    expect(arrayItemValidator([true, true, 'fail'])).toBeFalsy();
  });
});

describe('getArrayValidators', () => {
  it('puts the isArrayValidator function at the front of the provided validator functions list if isArray is set to true and validatArrayItems is set to false', () => {
    const validatorFunctions = getArrayValidators({ isArray: true }, [jest.fn()]);
    expect(validatorFunctions.shift()).toEqual(isArrayValidator);
  });

  it('returns the given validatorFns if both validateArrayItems and isArray are false', () => {
    const validatorFunctions = getArrayValidators({}, [(object: any) => true]);
    expect(validatorFunctions.shift()('anything')).toBeTruthy();
  });

  it('replaces all validatorFns with created arrayItemValidator if isArray and validateArrayItems is set to true', () => {
    const mockValidatorFn = jest.fn();
    const validatorFunctions = getArrayValidators({ isArray: true, validateArrayItems: true }, [mockValidatorFn]);
    expect(validatorFunctions.length).toEqual(1);
  });
});
