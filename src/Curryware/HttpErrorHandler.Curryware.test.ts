import { Response, Request } from 'express';
import { ErrorHandlerMock } from '../__mocks__/ErrorHandlerMock';
import { HttpError, curryHttpErrorHandler, Handler } from '..';
import { getMockResponse } from '../__mocks__/Express/responseMock';

let mockResponse: Response;
let httpErrorHandler: Handler;
let errorHandlerMock: ErrorHandlerMock;

beforeEach(() => {
  mockResponse = getMockResponse();
  errorHandlerMock = new ErrorHandlerMock(jest.fn());
  errorHandlerMock.mockFn.mockRejectedValue(new HttpError(403, 'Unauthorized'));
  httpErrorHandler = curryHttpErrorHandler(errorHandlerMock.handlesHttpError.bind(errorHandlerMock));
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('HttpError Handler', () => {
  it('should send the response code and status related to a thrown http error', async () => {
    await httpErrorHandler({} as Request, mockResponse, jest.fn());
    expect(mockResponse.status).toHaveBeenLastCalledWith(403);
    expect(mockResponse.send).toHaveBeenLastCalledWith({ code: 403, message: 'Unauthorized' });
  });

  it('should send a 500 code if it catches a non HttpError', async () => {
    errorHandlerMock.mockFn.mockRejectedValue(new Error('Uncaught'));
    await httpErrorHandler({} as Request, mockResponse, jest.fn());
    expect(mockResponse.status).toHaveBeenLastCalledWith(500);
  });

  it('should not send a response if a response has already been send', async () => {
    await httpErrorHandler({} as Request, { ...mockResponse, headersSent: true } as Response, jest.fn());
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.send).not.toHaveBeenCalled();
  });
});
