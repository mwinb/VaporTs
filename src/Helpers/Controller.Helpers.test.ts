import { Router } from 'express';
import { getMockrouter } from '../__mocks__/Express/routerMock';
import { mockMiddleware } from '../__mocks__/Express/mockMiddleware';
import { getControllerDoc, initControllerMiddleware, DocTsController, isDocTsController } from '..';
import { MockControllerWithMiddleWare, MockControllerWithoutMiddleWare } from '../__mocks__/controllerMocks';

let testController: DocTsController;
beforeEach(() => {
  testController = new MockControllerWithoutMiddleWare();
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
    router = getMockrouter() as any;
  });
  it('does not initialize the controllers middleware if no middleware was provided', () => {
    initControllerMiddleware(router, testController);
    expect(router.use).not.toHaveBeenCalled();
  });
  it('initializes the controllers middle ware', () => {
    testController = new MockControllerWithMiddleWare();
    initControllerMiddleware(router, testController);
    expect(router.use).toHaveBeenCalledWith(testController.controllerDoc.path, mockMiddleware);
  });
});

describe('objectIsDocTsController', () => {
  it('returns true if the object has a controller doc on prototype.', () => {
    expect(isDocTsController(testController)).toBeTruthy();
  });

  it('returns false if the provided object does not have a controller doc', () => {
    expect(isDocTsController({})).toBeFalsy();
  });
});
