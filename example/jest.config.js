module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testRegex: '\\.test\\.ts',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/app.ts',
    '!src/server.ts',
    '!src/__mocks__',
    '!src/**/*.integration.ts',
    '!src/**/*.test.ts'
  ]
};
