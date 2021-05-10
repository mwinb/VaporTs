import { Controller, Route, Validate } from '..';
import { MockSubSubValidator } from './ValidatorMocks';
import { mockMiddleware } from './Express/mockMiddleware';

@Controller('/test')
export class MockControllerWithoutMiddleWare {}

@Controller('/test', [mockMiddleware])
export class MockControllerWithMiddleWare {}

@Controller('/test')
export class MockControllerWithRoutes {
  mockFn: (...args: any[]) => Promise<any>;
  errorFn: (...args: any[]) => void;

  constructor() {
    this.mockFn = jest.fn();
    this.errorFn = jest.fn();
  }
  @Route('GET')
  async mockRoute(...args: any[]): Promise<any> {
    return await this.mockFn(...args);
  }

  @Route('GET', { path: '/:param' })
  async mockRouteWithPath(): Promise<any> {
    return await this.mockFn();
  }

  @Route('GET', { middleware: [mockMiddleware] })
  async mockRouteWithMiddleware(...args: any[]): Promise<any> {
    return await this.mockFn(...args);
  }

  @Route('GET', { path: ['/pathone', '/pathtwo'] })
  async mockRouteWithMultiplePaths(...args: any[]): Promise<any> {
    return await this.mockFn(...args);
  }

  @Route('GET', { handleResponse: false })
  async mockRouteWithoutResponseHandler(...args: any[]): Promise<void> {
    await this.mockFn(...args);
  }

  @Route('GET', { responseCode: 201 })
  async mockRouteWithCustomCode(...args: any[]): Promise<any> {
    return await this.mockFn(...args);
  }

  @Route('GET', { applyHttpError: false })
  async mockRouteNoHttpError(...args: any[]): Promise<any> {
    try {
      return await this.mockFn(...args);
    } catch (err) {
      this.errorFn(err);
    }
  }
}

@Controller('/test')
export class MockControllerWithRouteValidation {
  mockFn: (...args: any[]) => Promise<void>;

  constructor() {
    this.mockFn = jest.fn();
  }

  @Validate(new MockSubSubValidator(), 'body')
  async mockRoute(...args: any[]): Promise<void> {
    await this.mockFn(...args);
  }

  @Validate({ invalidField: 'string' }, 'body')
  async mockInvalidValidatorRoute(...args: any[]): Promise<void> {
    await this.mockFn(...args);
  }

  @Validate(new MockSubSubValidator(), 'invalidRequestField')
  async mockInvalidRequestFieldRoute(...args: any[]): Promise<void> {
    await this.mockFn(...args);
  }

  @Validate(new MockSubSubValidator(), 'body', { isArray: true })
  async mockArrayValidatorRoute(...args: any[]): Promise<void> {
    await this.mockFn(...args);
  }
}
