import { Evaluator } from '../Types/Evaluator.Type';

export interface DocTsValidator {
  validatorDoc: ValidatorDoc;
}

export interface ValidatorDoc {
  evaluators: Map<string, Evaluator[]>;
}

export interface ValidatorFieldConfig {
  isArray?: boolean;
  evaluateEachItem?: boolean;
}
