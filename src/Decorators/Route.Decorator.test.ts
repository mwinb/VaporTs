import { Request, Response } from 'express';
import { getMockResponse } from '../__mocks__/Express/responseMock';
import { mockMiddleware } from '../__mocks__/Express/mockMiddleware';
import { MockControllerWithRoutes } from '../__mocks__/controllerMocks';
import { RouteDoc, getControllerDoc, HttpError } from '..';

let testController: MockControllerWithRoutes;

beforeEach(() => {
  testController = new MockControllerWithRoutes();
});

describe('Router Decorator', () => {
  let routes: Map<string, RouteDoc>;
  beforeEach(() => {
    routes = getControllerDoc(testController).routes;
  });
  it('Adds the functions route to its target class controllerDocs route field', () => {
    expect(routes.get('mockRoute').method).toBe('GET');
  });

  it('adds the decorated function path to the target controllers controllerDocs', () => {
    expect(routes.get('mockRouteWithPath').paths.pop()).toEqual('/:param');
  });

  it('handles multiple paths', () => {
    expect(routes.get('mockRouteWithMultiplePaths').paths.length).toBe(2);
  });

  it('adds the decorated functions middleware to the target controllers controllerDocs', () => {
    expect(routes.get('mockRouteWithMiddleware').middleware).toEqual([mockMiddleware]);
  });

  describe('HandleResponse', () => {
    let mockResponse: Response;
    let returnVal: string;
    beforeEach(() => {
      mockResponse = getMockResponse();
      returnVal = 'returnValue';
      jest.spyOn(testController, 'mockFn').mockResolvedValueOnce(returnVal);
    });

    describe('defaults', () => {
      beforeEach(async () => {
        await testController.mockRoute({}, mockResponse);
      });
      it('applies the Response Handler by default', () => {
        expect(mockResponse.send).toHaveBeenLastCalledWith(returnVal);
      });

      it('uses 200 for status code by default', () => {
        expect(mockResponse.status).toHaveBeenLastCalledWith(200);
      });
    });

    it('takes a custom code', async () => {
      await testController.mockRouteWithCustomCode({}, mockResponse);
      expect(mockResponse.status).toHaveBeenLastCalledWith(201);
    });

    it('allows for disabling response handling', async () => {
      await testController.mockRouteWithoutResponseHandler({}, mockResponse);
      expect(mockResponse.status).not.toHaveBeenCalled();
    });
  });

  describe('HttpError', () => {
    let mockRequest: Request;
    let mockResponse: Response;
    let httpError: HttpError;
    beforeEach(() => {
      mockRequest = {} as any;
      mockResponse = getMockResponse();
      httpError = new HttpError(404, 'Not Found');
    });

    it('adds async httpError handling by default', async () => {
      jest.spyOn(testController, 'mockFn').mockRejectedValueOnce(httpError);
      await testController.mockRoute(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });

    it('allows disabling the async HttpError handling', async () => {
      jest.spyOn(testController, 'mockFn').mockRejectedValueOnce(httpError);
      await testController.mockRouteNoHttpError(mockRequest, mockResponse);
      expect(testController.errorFn).toHaveBeenCalledWith(httpError);
    });
  });
});
