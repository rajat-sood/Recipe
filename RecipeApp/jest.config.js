module.exports = {
  preset: 'jest-expo/jest-preset.js',
  // setupFilesAfterEnv: ['./node_modules/@testing-library/jest-native/extend-expect'], // Temporarily removed
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
  // Ensure setupFiles is not accidentally overriding something. It's not present, which is fine.
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'], // Keep ts/tsx for future
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx}', // Target src directory
    '!src/**/__tests__/**', // Exclude test files themselves
    '!src/**/__mocks__/**', // Exclude mock files
    '!src/navigation/**',
    '!src/services/**', // Mock services instead of testing implementation directly in unit tests
    '!src/store/**', // Store setup might need specific tests or be part of integration
    '!src/App.js', // Main App component
    '!src/**/index.js', // Export files
  ],
  coverageReporters: ['html', 'text', 'text-summary', 'lcov'],
  // coverageThreshold: { // Example, can be activated later
  //   global: {
  //     branches: 70,
  //     functions: 70,
  //     lines: 70,
  //     statements: 70,
  //   },
  // },
};
