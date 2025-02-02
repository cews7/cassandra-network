import Fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import { router } from './trpc/trpc'
import { predictionsRouter } from './trpc/routers/predictions'
import { inviteRouter } from './trpc/routers/invite'

// Create main tRPC router
export const appRouter = router({
  predictions: predictionsRouter,
  invite: inviteRouter,
})

// Export type for frontend
export type AppRouter = typeof appRouter

export async function buildApp(opts: { testing: boolean } = { testing: false }) {
  const server = Fastify({
    logger: opts.testing ? false : true,
    maxParamLength: 5000,
  })
  
  await server.register(fastifyCors, {
    origin: [
      'http://localhost:3000',  // Nuxt dev server
      'http://localhost:3001',  // API server
      'http://host.docker.internal:3000',
      'http://127.0.0.1:3000',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-trpc-source'],
  })

  // Register tRPC
  await server.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: { 
      router: appRouter,
    }
  })

  return server
}
  