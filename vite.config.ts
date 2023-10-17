import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: 'https://alddar.github.io/big-log-react/',
  server: {
    watch: {
      usePolling: true
    }
  }
})
