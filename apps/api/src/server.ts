import Fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import { router, createContext } from './trpc'
import { predictionsRouter } from './routes/predictions'

// Create main tRPC router
const appRouter = router({
  predictions: predictionsRouter,
})

// Export type for frontend
export type AppRouter = typeof appRouter

export async function buildApp(opts: { testing: boolean } = { testing: false }) {
  const server = Fastify({
    logger: opts.testing ? false : true
  })
  
  await server.register(fastifyCors, {
    origin: true
  })

  // Register tRPC
  await server.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: { 
      router: appRouter,
      createContext,
    }
  })

  return server
}
  