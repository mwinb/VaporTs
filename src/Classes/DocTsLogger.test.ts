import { DocLogger } from './DocTsLogger';

describe('DocTs Logger', () => {
  let mockLogger: jest.Mock<any, any>;
  let testLogger: DocLogger;
  beforeEach(() => {
    mockLogger = jest.fn();
    testLogger = new DocLogger(mockLogger);
  });

  it('uses console.log as default logger', () => {
    expect(new DocLogger().log).toEqual(console.log);
  });

  it('takes an optional logger fn', () => {
    expect(testLogger.log).toEqual(mockLogger);
  });

  it('calls the logger', () => {
    testLogger.log('log');
    expect(mockLogger).toHaveBeenCalledTimes(1);
  });

  it('allows for setting the logger fn', () => {
    const newLogger = jest.fn();
    testLogger.log = newLogger;
    expect(testLogger.log).toEqual(newLogger);
  });
});
