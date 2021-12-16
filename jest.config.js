module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/app.ts',
    '!src/server.ts',
    '!src/**/*index*',
    '!<rootDir>/node_modules/',
    '!<rootDir>/src/__mocks__',
    '!<rootDir>/src/DocTS/interfaces/*',
    '!<rootDir>/dist/*'
  ]
};
