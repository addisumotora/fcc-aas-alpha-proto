module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  moduleNameMapper: {
    // Force module uuid to resolve with the CJS entry point, because Jest does not support package.json.exports. See https://github.com/uuidjs/uuid/issues/451
    "uuid": require.resolve('uuid'),
    '^src/(.*)$': '<rootDir>/src/$1',
    '@uswds': '<rootDir>/node_modules/@uswds/uswds/packages/uswds-core/src/js/index.js'

  },
  coverageDirectory: '<rootDir>/coverage/',
  // coverageReporters: ['clover', 'cobertura', 'json', 'lcov', 'text'],
  coverageReporters: ['json', 'lcov', 'text', 'text-summary'],
  coveragePathIgnorePatterns: ["/node_modules/", '.mock.ts', '.model.ts'],
  reporters: [
    'default',
    'github-actions'
  ],
};
