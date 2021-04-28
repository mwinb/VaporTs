import { getControllerDoc, RouteDoc, getRouteDocs, getRouteMethodNames, initializeRoutes } from '..';
import { MockControllerWithRoutes } from '../__mocks__/controllerMocks';
import { getMockrouter } from '../__mocks__/Express/routerMock';

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

describe('initializing routes', () => {
  it('initializes the decorated route methods and adds them to the provided router', () => {
    const mockRouter = getMockrouter() as any;
    const routeDocs = Array.from(getControllerDoc(testController).routes.entries());
    let callIndex = 1;
    initializeRoutes(mockRouter, testController);
    routeDocs.forEach((routerMethod: [string, RouteDoc]) => {
      routerMethod[1].paths.forEach((p: string) => {
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
