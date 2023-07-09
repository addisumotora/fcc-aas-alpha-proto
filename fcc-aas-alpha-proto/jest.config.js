/** @type import("jest").Config */
module.exports = {
  modulePaths: ['<rootDir>'],
  coverageReporters: ['json', 'lcov', 'text', 'text-summary'],
  testMatch: ['<rootDir>/lambda/__tests__/**/*.test.ts'],
  coverageDirectory: '<rootDir>/lambda/coverage/',
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/lambda/src/**/*.ts', '<rootDir>/tools/*.ts'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules',
    '<rootDir>/data',
    '<rootDir>/.git',
    '<rootDir>/.github',
    '<rootDir>/.aws-sam',
    '<rootDir>/.devcontainer',
    '<rootDir>/.vscode',
    '<rootDir>/docs',
    '<rootDir>/lambda/events',
    '<rootDir>/lambda/responses',
    '<rootDir>/markdown',
  ],
};

process.env.DB_CLUSTER_ARN = 'arn:aws:rds:us-east-1:101408981074:cluster:fcc-dev-rdscluster';
process.env.DB_SECRET_ARN = 'arn:aws:secretsmanager:us-east-1:101408981074:secret:fcc-dev-DBSecret-EbsZBp';
process.env.DB_NAME = 'mockDatabaseName';
process.env.ItemsSQSQueue = 'mockQueue'
