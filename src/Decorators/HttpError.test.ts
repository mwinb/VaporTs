import { Response } from 'express';
import { getMockResponse } from '../__mocks__/Express/responseMock';
import { handleHttpError, HttpError, HttpErrorHandler } from './HttpError';

const mockClass = {
  mockFunction: Function
};

describe('HttpError', () => {
  let mockResponse: Response;
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
    expect(mockResponse.json).toHaveBeenLastCalledWith({
      code: 404,
      message: 'Not Found'
    });
  });

  it('responds with an error code of 500 if an Error is thrown instead of an HttpError', () => {
    handleHttpError(new Error('Uh Oh'), mockResponse);
    expect(mockResponse.status).toHaveBeenLastCalledWith(500);
  });

  describe('HttpErrorHandler Decorator', () => {
    let descriptor: PropertyDescriptor;
    beforeEach(() => {
      descriptor = HttpErrorHandler({}, '', Object.getOwnPropertyDescriptor(mockClass, 'mockFunction'));
    });
    it('returns a new function given the property descriptor of the old function', () => {
      expect(typeof descriptor.value).toBe('function');
    });

    it('it calls the original function with the value of the property descriptor', () => {
      descriptor.value();
      expect(mockClass.mockFunction).toHaveBeenCalled();
    });

    it('it calls handleHttpError function if the original function fails', async () => {
      mockClass.mockFunction = jest.fn().mockRejectedValue(new HttpError(404, 'Not Found'));
      descriptor = HttpErrorHandler({}, '', Object.getOwnPropertyDescriptor(mockClass, 'mockFunction'));
      await descriptor.value({}, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });
  });
});
