import { ResponseHandler } from '..';

export class MockResponseHandler {
  constructor(public mockFn: jest.Mock<any, any>) {}
  @ResponseHandler()
  async defaultCode(...args: any[]): Promise<any> {
    return await this.mockFn(...args);
  }

  @ResponseHandler(201)
  async customCode(...args: any[]): Promise<any> {
    return await this.mockFn(...args);
  }
}
