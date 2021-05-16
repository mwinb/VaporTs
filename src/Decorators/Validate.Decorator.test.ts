import { Response } from 'express';
import { getMockResponse } from '../__mocks__/Express/responseMock';
import { MockControllerWithRouteValidation } from '../__mocks__/controllerMocks';
import { getControllerDoc, getRouteDoc, getModifiedRouteMethod, ControllerDoc } from '..';

describe('ValidateRoute', () => {
  let mockRouteValidatorController: MockControllerWithRouteValidation;
  let mockResponse: Response;
  let controllerDoc: ControllerDoc;
  let validationHandler: any;
  beforeEach(() => {
    mockRouteValidatorController = new MockControllerWithRouteValidation();
    mockRouteValidatorController.mockRoute = mockRouteValidatorController.mockRoute.bind(mockRouteValidatorController);
    controllerDoc = getControllerDoc(mockRouteValidatorController);
    validationHandler = getModifiedRouteMethod(
      getRouteDoc(controllerDoc, 'mockRoute').generators,
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
  it('sends a 400 status if it fails validation', async () => {
    await validationHandler({ body: { booleanField: true } }, mockResponse);
    expect(mockResponse.status).toHaveBeenLastCalledWith(400);
  });

  it('handles validating an array of the Validator Type from request field', async () => {
    validationHandler = getModifiedRouteMethod(
      getRouteDoc(controllerDoc, 'mockArrayValidatorRoute').generators,
      mockRouteValidatorController.mockArrayValidatorRoute.bind(mockRouteValidatorController)
    );
    await validationHandler({
      body: [{ stringField: 'String' }, { stringField: 'String2' }]
    });
    expect(mockRouteValidatorController.mockFn).toHaveBeenCalledTimes(1);
  });

  it('uses isJsonObjectEvaluator if an invalid DocTsEvaluator is passed', async () => {
    validationHandler = getModifiedRouteMethod(
      getRouteDoc(controllerDoc, 'mockInvalidValidatorRoute').generators,
      mockRouteValidatorController.mockInvalidValidatorRoute.bind(mockRouteValidatorController)
    );
    await validationHandler({ body: { booleanField: true } }, mockResponse);
    expect(mockRouteValidatorController.mockFn).toHaveBeenCalledTimes(1);
  });

  it('sends a 501 status if the request field is invalid', async () => {
    mockRouteValidatorController.mockInvalidRequestFieldRoute = mockRouteValidatorController.mockInvalidRequestFieldRoute.bind(
      mockRouteValidatorController
    );
    validationHandler = getModifiedRouteMethod(
      getRouteDoc(controllerDoc, 'mockInvalidRequestFieldRoute').generators,
      mockRouteValidatorController.mockInvalidRequestFieldRoute
    );
    await validationHandler({ body: { stringField: 'string' } }, mockResponse);
    expect(mockRouteValidatorController.mockFn).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenLastCalledWith(501);
  });
});
