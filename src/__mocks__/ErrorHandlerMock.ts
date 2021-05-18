export class ErrorHandlerMock {
  constructor(public mockFn: jest.Mock<any, any>) {}
  async handlesHttpError(...args: any[]): Promise<any> {
    await this.mockFn(...args);
  }
}
