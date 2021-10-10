import { VapeRouter } from './VapeRouter';

describe('Vape Router', () => {
  it('is successfully constructed if the provided app has all required methods', () => {
    const mockVapeRouter = {
      get: jest.fn(),
      put: jest.fn(),
      post: jest.fn(),
      patch: jest.fn(),
      listen: jest.fn(),
      delete: jest.fn(),
      use: jest.fn(),
      head: jest.fn(),
      all: jest.fn(),
    }
    const vapeRouter = new VapeRouter(mockVapeRouter)
    for(const field in mockVapeRouter) {
      vapeRouter[field]('someArg');
      expect(mockVapeRouter[field]).toHaveBeenCalledWith('someArg');
    }
  });

  it('throws an error with the missing method name if the provided app does not have all the required methods', () => {
    const mockVapeRouterMissingRequiredFields = {
    }
    let caughtException;
    try {
      new VapeRouter(mockVapeRouterMissingRequiredFields)
    } catch(e) {
      caughtException = e;
    }
    expect(caughtException.message).toContain('get');
  })
});