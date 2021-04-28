export const getMockrouter = (): Record<string, any> => {
  return {
    use: jest.fn(),
    get: jest.fn()
  };
};
