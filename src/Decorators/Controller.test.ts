import { Router } from 'express';
import { ExpressController } from '..';
import { MockControllerWithMiddleWare, MockControllerWithoutMiddleWare } from '../__mocks__/controllerMocks';
import { mockMiddleware } from '../__mocks__/Express/mockMiddleware';
import { getRouterMock } from '../__mocks__/Express/routerMock';
import { getControllerDoc, initControllerMiddleware } from './Controller';

describe('Controller decorator', () => {
  let testController: ExpressController;

  beforeEach(() => {
    testController = new MockControllerWithoutMiddleWare();
  });

  it('should set the path metadata', () => {
    expect(testController.controllerDoc.path).toBe('/test');
  });

  it('does not require middleware', () => {
    expect(testController.controllerDoc.middleware).toEqual([]);
  });

  describe('getControllerDoc', () => {
    it('gets the controller doc from a controller decorated class', () => {
      const controllerDoc = getControllerDoc(testController);
      expect(controllerDoc.path).toBeDefined();
      expect(controllerDoc.middleware).toBeDefined();
    });
  });

  describe('initControllerMiddleware', () => {
    let router: Router;
    beforeEach(() => {
      router = getRouterMock() as any;
    });
    it('does not initialize the controllers middleware if no middleware was provided', () => {
      initControllerMiddleware(router, testController);
      expect(router.use).not.toHaveBeenCalled();
    });
    it('initializes the controllers middle ware', () => {
      testController = new MockControllerWithMiddleWare();
      initControllerMiddleware(router, testController);
      expect(router.use).toHaveBeenCalledWith(testController.controllerDoc.path, [mockMiddleware]);
    });
  });
});
