import { VaporController } from '..';
import { MockControllerWithoutMiddleWare } from '../__mocks__/controllerMocks';

describe('Controller decorator', () => {
  let testController: VaporController;

  beforeEach(() => {
    testController = new MockControllerWithoutMiddleWare();
  });

  it('should set the path metadata', () => {
    expect(testController.controllerDoc.path).toBe('/test');
  });

  it('does not require middleware', () => {
    expect(testController.controllerDoc.middleware).toEqual([]);
  });
});
