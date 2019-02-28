module.exports = {
  setupFilesAfterEnv: ['./jest.setup.js'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/__tests__/test-helpers',
    '<rootDir>/__tests__/__fixtures__'
  ]
};
