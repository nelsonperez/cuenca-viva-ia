// Plan 000, phase 1: plain ts-jest for the framework-free domain.
// Phase 3 switches the preset to jest-preset-angular once Angular is installed.

/** @type {import('jest').Config} */
export default {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        // Type checking runs in `npm run typecheck`; here we only transpile.
        tsconfig: {
          module: 'commonjs',
          target: 'es2023',
          verbatimModuleSyntax: false,
          isolatedModules: true,
        },
      },
    ],
  },
  collectCoverageFrom: ['src/{engine,tutor,game}/**/*.ts', '!src/**/*.spec.ts'],
  coverageReporters: ['text-summary', 'text'],
  // Constitution, Art. 6.3.
  coverageThreshold: {
    './src/engine/': { lines: 95, branches: 90 },
    './src/tutor/': { lines: 95, branches: 90 },
    './src/game/': { lines: 95, branches: 90 },
  },
}
