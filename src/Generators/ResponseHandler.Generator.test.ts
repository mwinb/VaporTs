import { Response, Request } from 'express';
import { getResponseHandlerGenerator, Middleware } from '..';
import { getMockResponse } from '../__mocks__/Express/responseMock';
import { MockResponseHandler } from '../__mocks__/ResponseHandlerMock';

let mockClass: MockResponseHandler;
let mockResponse: Response;

beforeEach(() => {
  mockClass = new MockResponseHandler(jest.fn());
  mockResponse = getMockResponse();
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('ResponseHandler', () => {
  let responseHandler: Middleware;
  let responseData: Record<string, any>;
  beforeEach(() => {
    responseData = {
      someField: 'someValue'
    };
    mockClass.mockFn.mockResolvedValue(responseData);
    responseHandler = getResponseHandlerGenerator(200)(mockClass.withReturn.bind(mockClass));
  });
  describe('with return', () => {
    it('sets the status to the provided code', async () => {
      await responseHandler({} as Request, mockResponse, jest.fn());
      expect(mockResponse.status).toHaveBeenLastCalledWith(200);
    });
    it('calls res.send with the handled methods return value', async () => {
      await responseHandler({} as Request, mockResponse, jest.fn());
      expect(mockResponse.send).toHaveBeenLastCalledWith(responseData);
    });
  });

  describe('without return', () => {
    beforeEach(() => {
      mockClass.mockFn.mockImplementation();
      responseHandler = getResponseHandlerGenerator(200)(mockClass.withReturn.bind(mockClass));
    });

    it('calls sendStatus if no data is returned from the handled method.', async () => {
      await responseHandler({} as Request, mockResponse, jest.fn());
      expect(mockResponse.sendStatus).toHaveBeenLastCalledWith(200);
    });
  });

  describe('headers already sent', () => {
    it('does not send a response if res.headersSent is true', async () => {
      await responseHandler({} as Request, { ...mockResponse, headersSent: true } as Response, jest.fn());
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.send).not.toHaveBeenCalled();
    });
  });
});
