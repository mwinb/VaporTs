import { Evaluator } from '../Types/Evaluator.Type';

export interface DocTsValidator {
  validatorDoc: ValidatorDoc;
}

export interface ValidatorDoc {
  fieldValidators: Map<string, ValidatorFieldConfig>;
}

export interface ValidatorFieldConfig {
  isArray?: boolean;
  evaluateEachItem?: boolean;
  optional?: boolean;
  evaluators?: Evaluator[];
}

export const DEFAULT_VALIDATOR_FIELD_CONFIG: ValidatorFieldConfig = {
  isArray: false,
  evaluateEachItem: true,
  optional: false,
  evaluators: []
};
