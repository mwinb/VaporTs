import { Application } from 'express';
import { DocApp, getRoutesDocumentation } from '..';
import { getMockrouter } from '../__mocks__/Express/routerMock';
import { getMockResponse } from '../__mocks__/Express/responseMock';
import { mockMiddleware } from '../__mocks__/Express/mockMiddleware';
import { MockControllerWithRoutes } from '../__mocks__/controllerMocks';

let testDocApp: DocApp;
let mockExpressApp: Application;

describe('Constructor', () => {
  let initializeControllers: jest.SpyInstance<any, any>;
  let initializeMiddleware: jest.SpyInstance<any, any>;
  mockExpressApp = { use: jest.fn() } as any;

  beforeEach(() => {
    initializeMiddleware = jest.spyOn(DocApp.prototype, 'initializeControllers');
    initializeControllers = jest.spyOn(DocApp.prototype, 'initializeMiddlewares');
  });

  describe('All Required Set', () => {
    beforeEach(() => {
      testDocApp = new DocApp({
        controllers: [new MockControllerWithRoutes()],
        expressApplication: mockExpressApp,
        router: getMockrouter() as any
      });
    });

    it('sets the path to root by default', () => {
      expect(testDocApp.path).toBe('');
    });

    it('sets show api to false by default', () => {
      expect(testDocApp.showApi).toBeFalsy();
    });

    it('does not add a RouteDoc to the app for the api', () => {
      expect(testDocApp.routes[0].paths.pop()).not.toEqual('');
    });

    it('does not add the api path to the app', () => {
      expect(mockExpressApp.use).not.toHaveBeenLastCalledWith(testDocApp.path, testDocApp.api);
    });

    it('initializes app controllers on construction', () => {
      expect(initializeControllers).toHaveBeenCalled();
    });

    it('initializes middleware on construction', () => {
      expect(initializeMiddleware).toHaveBeenCalled();
    });
  });

  describe('No Api', () => {
    beforeEach(() => {
      testDocApp = new DocApp({
        showApi: true,
        controllers: [new MockControllerWithRoutes()],
        middleware: [mockMiddleware],
        expressApplication: mockExpressApp,
        router: getMockrouter() as any
      });
    });

    it('adds a GET method to DocApps RouteDocs if the showApi method is set to true', () => {
      expect(testDocApp.routes[0].method).toEqual('GET');
      expect(testDocApp.routes[0].paths.shift()).toEqual('/');
    });

    it('adds the api path to the router if show api is true', () => {
      expect(mockExpressApp.use).toHaveBeenLastCalledWith(testDocApp.path, testDocApp.api);
    });

    it('adds all controllers route docs to the apps route docs', () => {
      expect(testDocApp.routes.length).toBe(getRoutesDocumentation(new MockControllerWithRoutes()).length + 1);
    });

    it('returns an api with the list of routes and their methods', () => {
      const mockResponse = getMockResponse();
      testDocApp.api({} as any, mockResponse);
      expect(mockResponse.send).toHaveBeenCalled();
    });
  });

  describe('Custom path', () => {
    beforeEach(() => {
      testDocApp = new DocApp({
        path: '/testApp',
        showApi: false,
        controllers: [new MockControllerWithRoutes()],
        middleware: [mockMiddleware],
        expressApplication: mockExpressApp,
        router: getMockrouter() as any
      });
    });

    it('Sets the application base path to the provided path', () => {
      expect(testDocApp.expressApplication.use).toHaveBeenLastCalledWith('/testApp', testDocApp.router);
    });
  });

  describe('Custom Path and show api', () => {
    beforeEach(() => {
      testDocApp = new DocApp({
        path: '/testApp',
        showApi: true,
        controllers: [new MockControllerWithRoutes()],
        middleware: [mockMiddleware],
        expressApplication: mockExpressApp,
        router: getMockrouter() as any
      });
    });

    it('sets the api doc path to an empty string if a custom path is provided', () => {
      expect(testDocApp.routes[0].method).toEqual('GET');
      expect(testDocApp.routes[0].paths.pop()).toEqual('');
    });
  });

  describe('Invalid controllers', () => {
    it('throws an error if a provided controller is not a DocTsController', () => {
      let thrownError;
      try {
        testDocApp = new DocApp({
          path: '/testApp',
          showApi: true,
          controllers: [{}],
          middleware: [mockMiddleware],
          expressApplication: mockExpressApp,
          router: getMockrouter() as any
        });
      } catch (error) {
        thrownError = error;
      }
      expect(thrownError).toBeDefined();
    });
  });
});
