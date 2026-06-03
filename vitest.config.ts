import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    exclude: ['docs-site/**', 'node_modules/**'],
  },
})
