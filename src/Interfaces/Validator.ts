import { ValidatorFn } from '../Types/Validator';

export interface ValidatorDoc {
  validators: Map<string, ValidatorFn[]>;
}
