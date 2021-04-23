import { Response } from 'express';
import { HttpError, HttpErrorHandler } from '..';
import { getMockResponse } from '../__mocks__/Express/responseMock';

const mockClass = {
  mockFunction: Function
};
let mockResponse: Response;
beforeEach(() => {
  mockResponse = getMockResponse();
  mockClass.mockFunction = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
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
