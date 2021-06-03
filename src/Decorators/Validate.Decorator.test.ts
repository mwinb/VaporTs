import { Response } from 'express';
import { getMockResponse } from '../__mocks__/Express/responseMock';
import { MockControllerWithRouteValidation } from '../__mocks__/controllerMocks';
import { getControllerDoc, getRouteDoc, getWrappedRouteMethod, ControllerDoc } from '..';

describe('ValidateRoute', () => {
  let mockRouteValidatorController: MockControllerWithRouteValidation;
  let mockResponse: Response;
  let controllerDoc: ControllerDoc;
  let validationHandler: any;
  beforeEach(() => {
    mockRouteValidatorController = new MockControllerWithRouteValidation();
    mockRouteValidatorController.mockRoute = mockRouteValidatorController.mockRoute.bind(mockRouteValidatorController);
    controllerDoc = getControllerDoc(mockRouteValidatorController);
    validationHandler = getWrappedRouteMethod(
      getRouteDoc(controllerDoc, 'mockRoute').curriers,
      mockRouteValidatorController.mockRoute
    );
    mockResponse = getMockResponse();
  });

  it('returns a method that validates the provider DocTsValidator against an Express.Request.body object', async () => {
    await validationHandler({ body: { stringField: 'String' } }, mockResponse);
    expect(mockRouteValidatorController.mockFn).toHaveBeenCalledTimes(1);
  });

  it('strips any extra fields by default', async () => {
    const mockReq = { body: { stringField: 'String', extraField: 'extra' } };
    await validationHandler(mockReq);
    expect(mockReq.body['extraField']).toBeUndefined();
  });
  it('throws an HttpError with 400 status if it fails validation', async () => {
    let httpError;
    try {
      await validationHandler({ body: { booleanField: true } }, mockResponse);
    } catch (error) {
      httpError = error;
    }
    expect(httpError.code).toBe(400);
  });

  it('handles validating an array of the Validator Type from request field', async () => {
    validationHandler = getWrappedRouteMethod(
      getRouteDoc(controllerDoc, 'mockArrayValidatorRoute').curriers,
      mockRouteValidatorController.mockArrayValidatorRoute.bind(mockRouteValidatorController)
    );
    await validationHandler({
      body: [{ stringField: 'String' }, { stringField: 'String2' }]
    });
    expect(mockRouteValidatorController.mockFn).toHaveBeenCalledTimes(1);
  });

  it('uses isJsonObjectEvaluator if an invalid DocTsEvaluator is passed', async () => {
    validationHandler = getWrappedRouteMethod(
      getRouteDoc(controllerDoc, 'mockInvalidValidatorRoute').curriers,
      mockRouteValidatorController.mockInvalidValidatorRoute.bind(mockRouteValidatorController)
    );
    await validationHandler({ body: { booleanField: true } }, mockResponse);
    expect(mockRouteValidatorController.mockFn).toHaveBeenCalledTimes(1);
  });

  it('throws an HttpError with 501 code if the request field is invalid', async () => {
    mockRouteValidatorController.mockInvalidRequestFieldRoute =
      mockRouteValidatorController.mockInvalidRequestFieldRoute.bind(mockRouteValidatorController);
    validationHandler = getWrappedRouteMethod(
      getRouteDoc(controllerDoc, 'mockInvalidRequestFieldRoute').curriers,
      mockRouteValidatorController.mockInvalidRequestFieldRoute
    );
    let httpError;
    try {
      await validationHandler({ body: { stringField: 'string' } }, mockResponse);
    } catch (error) {
      httpError = error;
    }
    expect(mockRouteValidatorController.mockFn).not.toHaveBeenCalled();
    expect(httpError.code).toBe(501);
  });
});
