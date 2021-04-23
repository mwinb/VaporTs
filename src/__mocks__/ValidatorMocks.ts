import { String, Boolean, Number } from '..';
import { isString } from '../Decorators/Validators/String.Decorator';
import { ValidateProperty } from '../Decorators/Validators/ValidatorProperty';

export class MockValidatorClass {
  @String()
  stringField: string;

  @Boolean()
  booleanField: boolean;

  @Number()
  numberField: number;

  @ValidateProperty([isString])
  validatorProperty: string;
}
