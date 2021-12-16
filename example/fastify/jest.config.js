module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/app.ts',
    '!src/server.ts',
    '!src/__mocks__',
    '!src/**/*.integration.ts',
    '!src/**/*.test.ts'
  ]
};
