import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Single-file build used for the in-chat preview artifact
export default defineConfig({
  plugins: [react()],
  build: { outDir: 'dist-artifact', modulePreload: false, cssCodeSplit: false,
    rollupOptions: { output: { format: 'iife', inlineDynamicImports: true, entryFileNames: 'app.js', assetFileNames: 'app.[ext]' } } },
})
