import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

/**
 * Config values to use for vite.config.ts and vitest.config.ts
 * Two files are needed due to the typing error here: https://stackoverflow.com/questions/73032986/test-does-not-exist-in-type-userconfigexport-even-with-reference-types
 */
export const baseViteConfig = {
  build: {
    outDir: './dist',
    target: 'esnext', // Should match the target in tsconfig.json
  },
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@component-lib': path.resolve(__dirname, './src/components/lib'),
      '~': path.resolve(__dirname, './src'),
    },
  },
}

export default defineConfig({
  ...baseViteConfig,
  plugins: [react()],
})
