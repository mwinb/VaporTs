import { HttpError } from '..';
import { Response } from 'express';
import { ErrorHandlerMock } from '../__mocks__/ErrorHandlerMock';
import { getMockResponse } from '../__mocks__/Express/responseMock';

let mockResponse: Response;
let errorHandlerMock: ErrorHandlerMock;
beforeEach(() => {
  errorHandlerMock = new ErrorHandlerMock(jest.fn());
  mockResponse = getMockResponse();
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('HttpErrorHandler Decorator', () => {
  it('should send the response code and status related to a thrown http error', async () => {
    errorHandlerMock.mockFn.mockRejectedValueOnce(new HttpError(403, 'Unauthorized'));
    await errorHandlerMock.handlesHttpError({}, mockResponse);
    expect(mockResponse.status).toHaveBeenLastCalledWith(403);
    expect(mockResponse.send).toHaveBeenLastCalledWith({ code: 403, message: 'Unauthorized' });
  });

  it('should send a 500 code if it catches a non HttpError', async () => {
    errorHandlerMock.mockFn.mockRejectedValue(new Error('Uncaught'));
    await errorHandlerMock.handlesHttpError({}, mockResponse);
    expect(mockResponse.status).toHaveBeenLastCalledWith(500);
  });
});
