import { DocLogger } from './DocTsLogger';

describe('DocTs Logger', () => {
  let mockLogger: jest.Mock<any, any>;
  let testLogger: DocLogger;
  beforeEach(() => {
    mockLogger = jest.fn();
    testLogger = new DocLogger(mockLogger);
  });
  it('calls the logger', () => {
    testLogger.log('log');
    expect(mockLogger).toHaveBeenCalledTimes(1);
  });
});
