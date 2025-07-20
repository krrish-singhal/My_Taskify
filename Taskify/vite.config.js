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
          target: "http://localhost:5000",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
})
