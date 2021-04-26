import { ValidatorFn } from '../Types/Validator';

export interface ValidatorDoc {
  validators: Map<string, ValidatorFn[]>;
}

export interface ValidatorConfig {
  isArray?: boolean;
  validateArrayItems?: boolean;
}
