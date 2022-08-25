import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    viewportHeight: 550,
    viewportWidth: 660,
    baseUrl: 'http://localhost:3000',
  },
})
