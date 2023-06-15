/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'

import { baseViteConfig } from './vite.config'

export default defineConfig({
  ...baseViteConfig,
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './config/jest/jest-setup.ts',
    reporters: ['vitest-sonar-reporter', 'default'],
    outputFile: 'sonar-report.xml',
    coverage: {
      reporter: ['text', 'text-summary', 'html', 'lcovonly'],
      exclude: ['node_modules/', 'config/', 'src/tests', 'src/api/testData.ts'],
    },
  },
})
