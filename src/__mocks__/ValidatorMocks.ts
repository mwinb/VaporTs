import { String, Boolean, Number } from '..';
import { Validator } from '../Classes/Validator';
import { isStringValidator } from '../Decorators/Validators/String.Decorator';
import { ValidateProperty } from '../Decorators/Validators/ValidatorProperty';

export class MockValidatorClass extends Validator {
  @String()
  stringField: string;

  @String({ isArray: true, validateArrayItems: false })
  stringArrayField: string[];

  @Boolean()
  booleanField: boolean;

  @Boolean({ isArray: true, validateArrayItems: false })
  booleanArrayField: boolean[];

  @Number()
  numberField: number;

  @Number({ isArray: true, validateArrayItems: false })
  numberArrayField: number[];

  @ValidateProperty([isStringValidator])
  validatorProperty: string;
}
