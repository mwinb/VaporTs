import { VaporLogger } from './VaporLogger';

describe('Vapor Logger', () => {
  let mockLogger: jest.Mock<any, any>;
  let testLogger: VaporLogger;
  beforeEach(() => {
    mockLogger = jest.fn();
    testLogger = new VaporLogger(mockLogger);
  });
  it('calls the logger', () => {
    testLogger.log('log');
    expect(mockLogger).toHaveBeenCalledTimes(1);
  });
});
