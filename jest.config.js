module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  testMatch: ['**/__tests__/api-tests/**/*.js?(x)'],
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy', // For stylesheets
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js', // For images
  },
};
