import { Response } from 'express';
import { handleHttpError, HttpError } from '..';
import { getMockResponse } from '../__mocks__/Express/responseMock';

describe('HttpError helpers', () => {
  let mockResponse: Response;
  const mockClass = {
    mockFunction: Function
  };

  beforeEach(() => {
    mockResponse = getMockResponse();
    mockClass.mockFunction = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('responds with the status code from HttpError', () => {
    handleHttpError(new HttpError(404, 'Not Found'), mockResponse);
    expect(mockResponse.status).toHaveBeenLastCalledWith(404);
  });

  it('responds with the json of the Http Error', () => {
    handleHttpError(new HttpError(404, 'Not Found'), mockResponse);
    expect(mockResponse.send).toHaveBeenLastCalledWith({
      code: 404,
      message: 'Not Found'
    });
  });

  it('responds with an error code of 500 if an Error is thrown instead of an HttpError', () => {
    handleHttpError(new Error('Uh Oh'), mockResponse);
    expect(mockResponse.status).toHaveBeenLastCalledWith(500);
  });

  it('does nothing if the headers have been sent', () => {
    handleHttpError(new Error('Uh oh'), { ...mockResponse, headersSent: true } as any);
    expect(mockResponse.status).not.toHaveBeenCalled();
  });
});
