import { MockControllerWithRoutes } from '../__mocks__/controllerMocks';
import { mockMiddleware } from '../__mocks__/Express/mockMiddleware';
import { getMockrouter } from '../__mocks__/Express/routerMock';
import { DocApp } from './DocApp';
import { Application } from 'express';
import { getMockResponse } from '../__mocks__/Express/responseMock';
import { getRouteDocs } from '../Decorators/Route';

let testDocApp: DocApp;
let mockExpressApp: Application;

describe('Constructor', () => {
  let initializeControllers: jest.SpyInstance<any, any>;
  let initializeMiddleware: jest.SpyInstance<any, any>;
  mockExpressApp = { use: jest.fn() } as any;

  beforeEach(() => {
    initializeControllers = jest.spyOn(DocApp.prototype, 'initializeMiddlewares');
    initializeMiddleware = jest.spyOn(DocApp.prototype, 'initializeControllers');
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

    it('sets show api to true by default', () => {
      expect(testDocApp.showApi).toBeTruthy();
    });

    it('initializes app controllers on construction', () => {
      expect(initializeControllers).toHaveBeenCalled();
    });

    it('initializes middleware on construction', () => {
      expect(initializeMiddleware).toHaveBeenCalled();
    });

    it('adds a GET method to DocApps RouteDocs if the showApi method is set to true', () => {
      expect(testDocApp.routes[0].method).toEqual('GET');
      expect(testDocApp.routes[0].path).toEqual('/');
    });

    it('adds the api path to the router if show api is true', () => {
      expect(mockExpressApp.use).toHaveBeenLastCalledWith(testDocApp.path, testDocApp.api);
    });

    it('adds all controllers route docs to the apps route docs', () => {
      expect(testDocApp.routes.length).toBe(getRouteDocs(new MockControllerWithRoutes()).length + 1);
    });

    it('returns an api with the list of routes and their methods', () => {
      const mockResponse = getMockResponse();
      testDocApp.api({} as any, mockResponse);
      expect(mockResponse.send).toHaveBeenCalled();
    });
  });

  describe('No Api', () => {
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

    it('does not add a RouteDoc to the app for the api', () => {
      expect(testDocApp.routes[0].path).not.toEqual('');
    });

    it('does not add the api path to the app', () => {
      expect(mockExpressApp.use).not.toHaveBeenLastCalledWith(testDocApp.path, testDocApp.api);
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
        controllers: [new MockControllerWithRoutes()],
        middleware: [mockMiddleware],
        expressApplication: mockExpressApp,
        router: getMockrouter() as any
      });
    });

    it('sets the api doc path to an empty string if a custom path is provided', () => {
      expect(testDocApp.routes[0].method).toEqual('GET');
      expect(testDocApp.routes[0].path).toEqual('');
    });
  });

  describe('Invalid controllers', () => {
    beforeEach(() => {
      testDocApp = new DocApp({
        path: '/testApp',
        controllers: [{}],
        middleware: [mockMiddleware],
        expressApplication: mockExpressApp,
        router: getMockrouter() as any
      });
    });

    it('does not add route docs if the controller does not have controllerDoc field', () => {
      expect(testDocApp.routes.length).toBe(1);
    });
  });
});
