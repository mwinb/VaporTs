import { Response } from 'express';
import { getMockResponse } from '../__mocks__/Express/responseMock';
import { MockControllerWithRouteValidation } from '../__mocks__/controllerMocks';

describe('ValidateRoute', () => {
  let mockRouteValidatorController: MockControllerWithRouteValidation;
  let mockResponse: Response;
  beforeEach(() => {
    mockRouteValidatorController = new MockControllerWithRouteValidation();
    mockResponse = getMockResponse();
  });

  it('returns a method that validates the provider DocTsValidator against an Express.Request.body object', async () => {
    await mockRouteValidatorController.mockRoute({ body: { stringField: 'String' } }, mockResponse);
    expect(mockRouteValidatorController.mockFn).toHaveBeenCalledTimes(1);
  });

  it('strips any extra fields by default', async () => {
    const mockReq = { body: { stringField: 'String', extraField: 'extra' } };
    await mockRouteValidatorController.mockRoute(mockReq);
    expect(mockReq.body['extraField']).toBeUndefined();
  });

  it('handles validating an array of the Validator Type from request field', async () => {
    await mockRouteValidatorController.mockArrayValidatorRoute({
      body: [{ stringField: 'String' }, { stringField: 'String2' }]
    });
    expect(mockRouteValidatorController.mockFn).toHaveBeenCalledTimes(1);
  });

  it('sends a 400 status if it fails validation', async () => {
    await mockRouteValidatorController.mockRoute({ body: { booleanField: true } }, mockResponse);
    expect(mockResponse.status).toHaveBeenLastCalledWith(400);
  });

  it('uses isJsonObjectEvaluator if an invalid DocTsEvaluator is passed', async () => {
    await mockRouteValidatorController.mockInvalidValidatorRoute({ body: { booleanField: true } }, mockResponse);
    expect(mockRouteValidatorController.mockFn).toHaveBeenCalledTimes(1);
  });

  it('sends a 501 status if the request field is invalid', async () => {
    await mockRouteValidatorController.mockInvalidRequestFieldRoute({ body: { stringField: 'string' } }, mockResponse);
    expect(mockRouteValidatorController.mockFn).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenLastCalledWith(501);
  });
});
