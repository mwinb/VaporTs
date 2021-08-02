import {
  HttpError,
  Evaluator,
  VaporValidator,
  getValidatorDoc,
  ValidatorFieldConfig,
  failedEvaluatorMessage,
  requiredFieldWarningMessage
} from '..';

const handleRequiredField = (
  hasField: boolean,
  fieldEvaluator: () => boolean,
  object: Record<string, any>,
  field: string
): boolean => {
  if (!hasField) throw new HttpError(400, requiredFieldWarningMessage(field, object));
  return fieldEvaluator();
};

const handleOptionalField = (hasField: boolean, fieldEvaluator: () => boolean): boolean => {
  return hasField ? fieldEvaluator() : true;
};

const getFieldEvaluator = (
  evaluators: Evaluator[],
  objectToEvaluate: Record<string, any>,
  field: string
): (() => boolean) => {
  return () => {
    return evaluators.every(evaluator => {
      const passes = evaluator(objectToEvaluate[field]);
      if (!passes) throw new HttpError(400, failedEvaluatorMessage(evaluator, objectToEvaluate, field));
      return passes;
    });
  };
};

const evaluateField = (
  fieldEvaluatorConfig: ValidatorFieldConfig,
  objectToEvaluate: Record<string, any>,
  field: string
): boolean => {
  const hasField = objectToEvaluate[field] !== undefined && objectToEvaluate[field] !== null;
  const fieldEvaluator = getFieldEvaluator(fieldEvaluatorConfig.evaluators, objectToEvaluate, field);
  return fieldEvaluatorConfig.optional
    ? handleOptionalField(hasField, fieldEvaluator)
    : handleRequiredField(hasField, fieldEvaluator, objectToEvaluate, field);
};

const evaluateValidatorFields = (
  flattenedFieldValidators: [string, ValidatorFieldConfig][],
  objectToEvaluate: Record<string, any>
): boolean => {
  return flattenedFieldValidators.every(([field, fieldEvaluatorConfig]) =>
    evaluateField(fieldEvaluatorConfig, objectToEvaluate, field)
  );
};

const stripFields = (objectToStrip: Record<string, any>, fieldValidators: Map<string, ValidatorFieldConfig>): void => {
  Object.keys(objectToStrip).forEach(key => {
    if (!fieldValidators.has(key)) delete objectToStrip[key];
  });
};

export const createValidatorEvaluator = (arg: VaporValidator, strip: boolean): Evaluator => {
  const validatorDoc = getValidatorDoc(arg);
  return (objectToEvaluate: Record<string, any>) => {
    strip && stripFields(objectToEvaluate, validatorDoc.fieldValidators);
    return evaluateValidatorFields(Array.from(validatorDoc.fieldValidators.entries()), objectToEvaluate);
  };
};
