import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { createApiMiddleware } from './server/api.ts'

// Runs the Ezob email API (server/api.ts) inside the Vite dev and preview
// servers, so `npm run dev` starts the website AND the API together.
// RESEND_API_KEY and the other settings are read here, on the server side only
// (from .env.local). They are never sent to the browser.
function ezobApi(env: Record<string, string>): Plugin {
  let handler: ReturnType<typeof createApiMiddleware> | undefined
  const api = () =>
    (handler ??= createApiMiddleware({
      resendApiKey: env.RESEND_API_KEY,
      adminEmail: env.ADMIN_EMAIL,
      fromEmail: env.FROM_EMAIL,
      logoUrl: env.EMAIL_LOGO_URL || undefined,
      rateLimitMax: env.RATE_LIMIT_MAX ? Number(env.RATE_LIMIT_MAX) : undefined,
    }))
  return {
    name: 'ezob-api',
    configureServer(server) {
      server.middlewares.use('/api', api())
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api', api())
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      react(),
      tailwindcss(),
      ezobApi(env),
    ],
  }
})
