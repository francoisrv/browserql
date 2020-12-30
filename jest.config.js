module.exports = {
  // ...
  testEnvironment: 'node',
  verbose: true,
  setupFilesAfterEnv: ['./setupTests.js'],
  transform: {
    // '^.+\\.css$': 'jest-transform-css',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': 'jest-transform-file'
  }
};
