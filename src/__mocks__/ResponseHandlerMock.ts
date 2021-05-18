export class MockResponseHandler {
  constructor(public mockFn: jest.Mock<any, any>) {}
  async withReturn(...args: any[]): Promise<any> {
    return await this.mockFn(...args);
  }

  async withoutReturn(...args: any[]): Promise<void> {
    await this.mockFn(...args);
  }
}
