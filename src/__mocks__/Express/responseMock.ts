export const getMockResponse = (): any => {
  return {
    status: jest.fn().mockReturnThis(),
    sendStatus: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis()
  };
};
