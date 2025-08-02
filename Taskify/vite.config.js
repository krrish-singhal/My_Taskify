import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    define: {
      "process.env.VITE_API_URL": JSON.stringify(process.env.VITE_API_URL),
      "process.env.VITE_CLIENT_URL": JSON.stringify(
        process.env.VITE_CLIENT_URL
      ),
    },

    server: {
      port: 5173,
      proxy: {
        "/api": {
          target: import.meta.env.VITE_API_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
})
