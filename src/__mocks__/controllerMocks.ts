import { Controller } from '../Decorators/Controller';
import { Route } from '../Decorators/Route';
import { mockMiddleware } from './Express/mockMiddleware';
@Controller('/test')
export class MockControllerWithoutMiddleWare {}

@Controller('/test', [mockMiddleware])
export class MockControllerWithMiddleWare {}

@Controller('/test')
export class MockControllerWithRoutes {
  mockFn: (...args: any[]) => Promise<void>;
  errorFn: (...args: any[]) => void;

  constructor() {
    this.mockFn = jest.fn();
    this.errorFn = jest.fn();
  }
  @Route('GET')
  async mockRoute(...args: any[]) {
    await this.mockFn(...args);
  }

  @Route('GET', { path: '/:param' })
  async mockRouteWithPath() {
    await this.mockFn();
  }

  @Route('GET', { middleware: [mockMiddleware] })
  async mockRouteWithMiddleware(...args: any[]) {
    await this.mockFn(...args);
  }

  @Route('GET', { path: ['/pathone', '/pathtwo'] })
  async mockRouteWithMultiplePaths(...args: any[]) {
    await this.mockFn(...args);
  }

  @Route('GET', { applyHttpError: false })
  async mockRouteNoHttpError(...args: any[]) {
    try {
      await this.mockFn(...args);
    } catch (err) {
      this.errorFn(err);
    }
  }
}
