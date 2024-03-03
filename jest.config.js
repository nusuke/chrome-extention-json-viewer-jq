module.exports = {
  roots: ["<rootDir>"],
  testMatch: [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)",
  ],
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest"],
  },
  coverageReporters: ["json-summary", "text", "lcov"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "\\.(css|scss)$": "<rootDir>/node_modules/jest-css-modules",
  },
  testPathIgnorePatterns: ["<rootDir>/src/constants/"],
  setupFilesAfterEnv: ["./jest.setup.js"],
};
