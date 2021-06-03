import { Evaluator } from '..';

export interface DocTsValidator {
  validatorDoc: ValidatorDoc;
}

export interface ValidatorDoc {
  fieldValidators: Map<string, ValidatorFieldConfig>;
}

export interface PrimitiveValidatorConfig {
  isArray?: boolean;
  evaluateEachItem?: boolean;
}

export interface ValidateConfig extends PrimitiveValidatorConfig {
  strip?: boolean;
}

export interface ValidatorFieldConfig extends PrimitiveValidatorConfig {
  evaluators?: Evaluator[];
  optional?: boolean;
}

export interface ValidatorConfig extends ValidateConfig, ValidatorFieldConfig {}

export const DEFAULT_VALIDATE_CONFIG: ValidateConfig = {
  isArray: false,
  evaluateEachItem: true,
  strip: true
};

export const DEFAULT_VALIDATOR_FIELD_CONFIG: ValidatorFieldConfig = {
  ...DEFAULT_VALIDATE_CONFIG,
  optional: false,
  evaluators: []
};
