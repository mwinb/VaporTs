import { String, Boolean, Number, SetPropertyEvaluators, isStringEvaluator, Validator, JsonObject } from '..';

export class MockSubSubValidator {
  @String()
  stringField: string;
}

export class MockValidatorWithSubValidator {
  @String()
  stringField: string;

  @Validator(new MockSubSubValidator())
  subValidator: MockSubSubValidator;
}

export class MockSubValidatorWithOptionalSubValidator {
  constructor(stringField = 'Test', booleanField = true, numberField = 10) {
    this.stringField = stringField;
    this.booleanField = booleanField;
    this.numberField = numberField;
  }

  @String()
  stringField: string;

  @Boolean()
  booleanField: boolean;

  @Number()
  numberField: number;

  @Validator(new MockSubSubValidator(), { optional: true })
  optionalSubSubValidator: MockSubSubValidator;
}

export class MockValidatorClass {
  @String()
  stringField: string;

  @String({ isArray: true, evaluateEachItem: false })
  stringArrayField: string[];

  @Boolean()
  booleanField: boolean;

  @Boolean({ isArray: true, evaluateEachItem: false })
  booleanArrayField: boolean[];

  @Number()
  numberField: number;

  @Number({ isArray: true, evaluateEachItem: false })
  numberArrayField: number[];

  @JsonObject()
  objectField: Record<string, any>;

  @JsonObject({ isArray: true, evaluateEachItem: false })
  objectArrayField: Record<string, any>[];

  @SetPropertyEvaluators([isStringEvaluator], { isArray: false, evaluateEachItem: false })
  validatorProperty: string;

  @Validator(new MockSubValidatorWithOptionalSubValidator())
  validatorField: MockSubValidatorWithOptionalSubValidator;

  @Validator(new MockSubValidatorWithOptionalSubValidator(), { isArray: true, evaluateEachItem: false })
  validatorArrayField: MockSubValidatorWithOptionalSubValidator[];
}

export class MockValidatorClassWithNonValidatorObject {
  @Validator({})
  nonDocTsValidatorField: any;
}
