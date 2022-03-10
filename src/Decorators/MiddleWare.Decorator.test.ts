import { Response, Request } from 'express';
import { getMockResponse } from '../__mocks__/Express/responseMock';
import { mockMiddleware } from '../__mocks__/Express/mockMiddleware';
import { RouteDoc, getControllerDoc, HttpError, Curryware } from '..';
import { MockControllerWithRoutes } from '../__mocks__/controllerMocks';

let testController: MockControllerWithRoutes;

beforeEach(() => {
  testController = new MockControllerWithRoutes();
});

describe('MiddleWare Decoration', () => {
  let routes: Map<string, RouteDoc>;
  beforeEach(() => {
    routes = getControllerDoc(testController).routes;
  });
  it('adds the provided middleware to the controllers routedoc definition', async () => {
    expect(routes.get('mockRouteWithMiddleWareDecorator').middleware).toEqual([mockMiddleware]);
  });
});
