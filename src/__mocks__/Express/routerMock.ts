export const getMockrouter = () => {
  return {
    use: jest.fn(),
    get: jest.fn()
  };
};
