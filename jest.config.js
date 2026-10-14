import presets from 'jest-preset-angular/presets/index.js'

/** @type {import('jest').Config} */
export default {
  ...presets.createCjsPreset({ tsconfig: '<rootDir>/tsconfig.spec.json' }),
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  collectCoverageFrom: ['src/{engine,tutor,game,app}/**/*.ts', '!src/**/*.spec.ts'],
  coverageReporters: ['text-summary', 'text'],
  // Constitution, Art. 6.3. The app thresholds join as phases 4 and 5 add code.
  coverageThreshold: {
    './src/engine/': { lines: 95, branches: 90 },
    './src/tutor/': { lines: 95, branches: 90 },
    './src/game/': { lines: 95, branches: 90 },
  },
}
