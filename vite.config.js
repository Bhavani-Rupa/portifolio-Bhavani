import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Add router support to the React plugin
      router: true,
    }),
  ],
  server: {
    port: 5173,
    open: true,
    middleware: [
      // Handle client-side routing
      (req, res, next) => {
        if (req.url.includes('.')) return next()
        res.end(
          require('fs').readFileSync('index.html', 'utf8')
        )
      }
    ]
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  preview: {
    port: 5173,
    historyApiFallback: true,
  }
})
