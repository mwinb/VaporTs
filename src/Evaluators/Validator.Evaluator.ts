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
    const val = objectToEvaluate[field];
    return typeof val === 'object'
      ? evaluators[0]({ req: objectToEvaluate, field: field })
      : evaluators.every(evaluator => {
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
  const hasField = objectToEvaluate[field] !== undefined;
  const fieldEvaluator = getFieldEvaluator(fieldEvaluatorConfig.evaluators, objectToEvaluate, field);
  return fieldEvaluatorConfig.optional
    ? handleOptionalField(hasField, fieldEvaluator)
    : handleRequiredField(hasField, fieldEvaluator, objectToEvaluate, field);
};

const evaluateValidatorFields = (
  flattenedFieldValidators: [string, ValidatorFieldConfig][],
  objectToEvaluate: Record<string, any>
): { result: boolean; stripped: Record<string, any> } => {
  const stripped = {};
  const result = flattenedFieldValidators.every(([field, fieldEvaluatorConfig]) => {
    stripped[field] = objectToEvaluate[field];
    return evaluateField(fieldEvaluatorConfig, objectToEvaluate, field);
  });
  return { result, stripped };
};

export const createValidatorEvaluatorFromReqField = (arg: VaporValidator, strip: boolean): Evaluator => {
  const validatorDoc = getValidatorDoc(arg);
  return (objectToEvaluate: Record<string, any>) => {
    const { result, stripped } = evaluateValidatorFields(
      Array.from(validatorDoc.fieldValidators.entries()),
      objectToEvaluate.req[objectToEvaluate.field]
    );
    if (strip) objectToEvaluate.req[objectToEvaluate.field] = stripped;
    return result;
  };
};
