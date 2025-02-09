import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/investment-calculator/',
  build: {
    outDir: 'docs',
    emptyOutDir: true
  }
})
