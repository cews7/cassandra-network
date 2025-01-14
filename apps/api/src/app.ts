import Fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import { router } from './trpc'
import { signupRoutes } from './routes/signup'
import { predictionsRouter } from './routes/predictions'
import supabasePlugin from './plugins/supabase'

// Create main router
const appRouter = router({
  predictions: predictionsRouter,
})

// Export type for frontend
export type AppRouter = typeof appRouter

export async function buildApp(opts: { testing: boolean } = { testing: false }) {
  const fastify = Fastify({
    logger: opts.testing ? false : true
  })
  
  await fastify.register(supabasePlugin)
  await fastify.register(signupRoutes)
  await fastify.register(fastifyCors, {
    origin: true
  })

  // Register tRPC
  await fastify.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: { router: appRouter }
  })
  
  return fastify
}
  