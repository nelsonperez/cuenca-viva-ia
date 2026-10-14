import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Plan 000: Vitest only runs the *.test.ts files not yet moved to Jest.
  test: { include: ['src/**/*.test.ts'] },
})
