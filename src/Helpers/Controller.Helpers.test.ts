import { mockMiddleware } from '../__mocks__/Express/mockMiddleware';
import { getMockExpressLikeApp } from '../__mocks__/ExpressLikeAppMock';
import { MockControllerWithMiddleWare, MockControllerWithoutMiddleWare } from '../__mocks__/controllerMocks';
import { getControllerDoc, initControllerMiddleware, VaporController, isVaporController, AppAdapter } from '..';

let testController: VaporController;
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
  let router: AppAdapter;
  beforeEach(() => {
    router = new AppAdapter(getMockExpressLikeApp());
  });
  it('does not initialize the controllers middleware if no middleware was provided', () => {
    initControllerMiddleware(router, testController);
    expect(router.app.use).not.toHaveBeenCalled();
  });
  it('initializes the controllers middle ware', () => {
    testController = new MockControllerWithMiddleWare();
    initControllerMiddleware(router, testController);
    expect(router.app.use).toHaveBeenCalledWith(testController.controllerDoc.path, mockMiddleware);
  });
});

describe('objectIsVaporController', () => {
  it('returns true if the object has a controller doc on prototype.', () => {
    expect(isVaporController(testController)).toBeTruthy();
  });

  it('returns false if the provided object does not have a controller doc', () => {
    expect(isVaporController({})).toBeFalsy();
  });
});
