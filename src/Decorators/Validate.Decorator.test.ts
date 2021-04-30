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

  it('sends a 400 status if it fails validation', async () => {
    await mockRouteValidatorController.mockRoute({ body: { booleanField: true } }, mockResponse);
    expect(mockResponse.status).toHaveBeenLastCalledWith(400);
  });

  it('uses isJsonObjectEvaluator if an invalid DocTsEvaluator is passed', async () => {
    await mockRouteValidatorController.mockInvalidValidatorRoute({ body: { booleanField: true } }, mockResponse);
    expect(mockRouteValidatorController.mockFn).toHaveBeenCalledTimes(1);
  });
});
