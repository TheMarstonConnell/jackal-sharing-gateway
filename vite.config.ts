import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  define: {
    window: {},
  },
  plugins: [
    nodePolyfills()
  ],
  resolve: {
    alias: {
    }
  }
})

