export const getMockExpressLikeApp = () => ({
  get: jest.fn(),
  put: jest.fn(),
  use: jest.fn(),
  all: jest.fn(),
  post: jest.fn(),
  head: jest.fn(),
  patch: jest.fn(),
  listen: jest.fn(),
  delete: jest.fn()
});
