import {
  RouteDoc,
  Curryware,
  getControllerDoc,
  initializeRoutes,
  getRouteMethodNames,
  getWrappedRouteMethod,
  getRoutesDocumentation
} from '..';
import { Response } from 'express';
import { getMockrouter } from '../__mocks__/Express/routerMock';
import { getMockResponse } from '../__mocks__/Express/responseMock';
import { MockControllerWithRoutes } from '../__mocks__/controllerMocks';

let testController: MockControllerWithRoutes;

beforeEach(() => {
  testController = new MockControllerWithRoutes();
});

describe('Getting Router Methods', () => {
  it('returns an array of all methods that have the Router Decorator from containing class', () => {
    const routerMethods = getRouteMethodNames(testController);
    expect(routerMethods.length).not.toEqual(Object.getOwnPropertyNames(Object.getPrototypeOf(testController)));
  });
});

describe('Getting Route Documentation', () => {
  it('returns a list of a controllers routes documents', () => {
    const expectedRouteDocs = Array.from(getControllerDoc(testController).routes.values());
    const actualRouteDocs = getRoutesDocumentation(testController);
    expect(expectedRouteDocs.length).toEqual(actualRouteDocs.length);
  });

  it('adds the controller path to the routes path within the route documents', () => {
    const routeDocs = getRoutesDocumentation(testController);
    expect(routeDocs[0].paths).toContain('/test');
  });
});

describe('getting generated fn', () => {
  let mockResponse: Response;
  let curriers: Curryware[];
  beforeEach(() => {
    mockResponse = getMockResponse();
    jest.spyOn(testController, 'mockFn').mockResolvedValue('Returned');
    testController.mockRoute = testController.mockRoute.bind(testController);
    curriers = getControllerDoc(testController).routes.get('mockRoute').curriers;
  });
  it('creates a generatedFn using a routes curriers', async () => {
    await getWrappedRouteMethod(curriers, testController.mockRoute)({} as any, mockResponse, {});
    expect(mockResponse.send).toHaveBeenCalledWith('Returned');
  });

  it('returns the original function if no curriers exist', async () => {
    expect(getWrappedRouteMethod(undefined, testController.mockRoute)).toEqual(testController.mockRoute);
  });
});

describe('initializing routes', () => {
  it('initializes the decorated route methods and adds them to the provided router', () => {
    const mockRouter = getMockrouter() as any;
    const routeDocs = Array.from(getControllerDoc(testController).routes.entries());
    let callIndex = 1;
    initializeRoutes('', mockRouter, testController);
    routeDocs.forEach((routerMethod: [string, RouteDoc]) => {
      routerMethod[1].paths.forEach((p: string) => {
        expect(mockRouter.get).toHaveBeenNthCalledWith(
          callIndex,
          '/test' + p,
          ...routerMethod[1].middleware,
          expect.anything()
        );
        callIndex += 1;
      });
    });
  });
});
