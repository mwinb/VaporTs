import { HttpErrorHandler } from '..';

export class ErrorHandlerMock {
  constructor(public mockFn: jest.Mock<any, any>) {}
  @HttpErrorHandler()
  async handlesHttpError(...args: any[]): Promise<any> {
    await this.mockFn(...args);
  }
}
