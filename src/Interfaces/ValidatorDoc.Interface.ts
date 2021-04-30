import { Evaluator } from '../Types/Evaluator.Type';

export interface DocTsValidator {
  validatorDoc: ValidatorDoc;
}

export interface FieldValidator {
  evaluators: Evaluator[];
  config: ValidatorFieldConfig;
}

export interface ValidatorDoc {
  fieldValidators: Map<string, FieldValidator>;
}

export interface ValidatorFieldConfig {
  isArray?: boolean;
  evaluateEachItem?: boolean;
  optional?: boolean;
}

export const DEFAULT_VALIDATOR_FIELD_CONFIG: ValidatorFieldConfig = {
  isArray: false,
  evaluateEachItem: true,
  optional: false
};
