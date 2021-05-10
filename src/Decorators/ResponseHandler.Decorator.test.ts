import express from 'express';
import { getMockResponse } from '../__mocks__/Express/responseMock';
import { MockResponseHandler } from '../__mocks__/ResponseHandlerMock';

let mockClass: MockResponseHandler;
let mockResponse: express.Response;
beforeEach(() => {
  mockClass = new MockResponseHandler(jest.fn());
  mockResponse = getMockResponse();
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('ResponseHandler', () => {
  it('calls response with status 200 by default', async () => {
    await mockClass.defaultCode({}, mockResponse);
    expect(mockResponse.sendStatus).toHaveBeenLastCalledWith(200);
  });

  it('calls res.send if the function returns a value', async () => {
    const expectedReturn = {
      someField: 'someValue'
    };
    mockClass.mockFn.mockResolvedValueOnce(expectedReturn);
    await mockClass.defaultCode({}, mockResponse);
    expect(mockResponse.status).toHaveBeenLastCalledWith(200);
    expect(mockResponse.send).toHaveBeenLastCalledWith(expectedReturn);
  });

  it('calls response with a custom code if one is provided', async () => {
    await mockClass.customCode({}, mockResponse);
    expect(mockResponse.sendStatus).toHaveBeenLastCalledWith(201);
  });

  it('does not send a response if res.headersSent is true', async () => {
    await mockClass.defaultCode({}, { ...mockResponse, headersSent: true });
    expect(mockResponse.sendStatus).not.toHaveBeenCalled();
    expect(mockResponse.send).not.toHaveBeenCalled();
  });
});
