import { Response } from 'express';
import { getMockResponse } from '../__mocks__/Express/responseMock';
import { handleHttpError, HttpError } from './HttpError';

describe('HttpError', () => {
  let mockResponse: Response;
  beforeEach(() => {
    mockResponse = getMockResponse();
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
    expect(mockResponse.json).toHaveBeenLastCalledWith({
      code: 404,
      message: 'Not Found'
    });
  });

  it('responds with an error code of 500 if an Error is thrown instead of an HttpError', () => {
    handleHttpError(new Error('Uh Oh'), mockResponse);
    expect(mockResponse.status).toHaveBeenLastCalledWith(500);
  });
});
