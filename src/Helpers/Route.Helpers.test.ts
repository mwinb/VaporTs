import {
  RouteDoc,
  Generator,
  getRouteDocs,
  getGenerators,
  getGeneratedFn,
  getControllerDoc,
  initializeRoutes,
  getRouteMethodNames,
  generateHttpErrorHandler
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

describe('getting generated fn', () => {
  let mockResponse: Response;
  let generators: Generator[];
  beforeEach(() => {
    mockResponse = getMockResponse();
    jest.spyOn(testController, 'mockFn').mockResolvedValue('Returned');
    testController.mockRoute = testController.mockRoute.bind(testController);
    generators = getControllerDoc(testController).routes.get('mockRoute').generators;
  });
  it('creates a generatedFn using a routes generators', async () => {
    await getGeneratedFn(generators, testController.mockRoute)({} as any, mockResponse, {});
    expect(mockResponse.send).toHaveBeenCalledWith('Returned');
  });

  it('returns the original function if no generators exist', async () => {
    expect(getGeneratedFn(undefined, testController.mockRoute)).toEqual(testController.mockRoute);
  });
});

describe('getting generators from RouteDoc', () => {
  it('returns the route docs generators if it has them', () => {
    const generators = [generateHttpErrorHandler];
    const result = getGenerators({ generators } as RouteDoc);
    expect(result).toEqual(generators);
  });

  it('returns an empty array if the RouteDoc does not have generators', () => {
    expect(getGenerators({} as RouteDoc)).toEqual([]);
  });
});

describe('initializing routes', () => {
  it('initializes the decorated route methods and adds them to the provided router', () => {
    const mockRouter = getMockrouter() as any;
    const routeDocs = Array.from(getControllerDoc(testController).routes.entries());
    let callIndex = 1;
    initializeRoutes(mockRouter, testController);
    routeDocs.forEach((routerMethod: [string, RouteDoc]) => {
      console.log(routerMethod[1].paths);
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
