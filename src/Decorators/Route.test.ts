import { Request, Response } from 'express';
import { RouteDoc } from '../Interfaces/RouteDoc';
import { MockControllerWithRoutes } from '../__mocks__/controllerMocks';
import { mockMiddleware } from '../__mocks__/Express/mockMiddleware';
import { getMockResponse } from '../__mocks__/Express/responseMock';
import { getMockrouter } from '../__mocks__/Express/routerMock';
import { getControllerDoc } from './Controller';
import { HttpError } from './HttpError';
import { getRouteMethodNames, getRouteDocs, initializeRoutes } from './Route';

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

describe('Getting Router Methods', () => {
  it('returns an array of all methods that have the Router Decorator from containing class', () => {
    const routerMethods = getRouteMethodNames(testController);
    expect(routerMethods.length).not.toEqual(Object.getOwnPropertyNames(Object.getPrototypeOf(testController)));
  });
});

describe('Getting RouteDocs', () => {
  it('returns a list of a controllers route docs', () => {
    const expectedRouteDocs = Array.from(getControllerDoc(testController).routes.values());
    const actualRouteDocs = getRouteDocs(testController);
    expect(expectedRouteDocs.length).toEqual(actualRouteDocs.length);
  });

  it('adds the controller path to the routes path within the route docs', () => {
    const routeDocs = getRouteDocs(testController);
    expect(routeDocs[0].paths).toContain('/test');
  });
});

describe('initializing routes', () => {
  it('initializes the decorated route methods and adds them to the provided router', () => {
    const mockRouter = getMockrouter() as any;
    const routeDocs = Array.from(getControllerDoc(testController).routes.entries());
    let callIndex = 1;
    initializeRoutes(mockRouter, testController);
    routeDocs.forEach((routerMethod: [string, RouteDoc]) => {
      routerMethod[1].paths.forEach((p: string, i: number) => {
        expect(mockRouter.get).toHaveBeenNthCalledWith(
          callIndex,
          '/test' + p,
          ...routerMethod[1].middleware,
          testController[routerMethod[0]]
        );
        callIndex += 1;
      });
    });
  });
});
