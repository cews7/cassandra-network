import { fastify } from 'fastify'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import { PrismaClient } from '@prisma/client'
import fastifyCors from '@fastify/cors'
import { predictionsRouter } from './routes/predictions'
import { router } from './trpc'

const prisma = new PrismaClient()
const server = fastify({
  logger: true
})

// Create main router
const appRouter = router({
  predictions: predictionsRouter,
})

const start = async () => {
  try {
    // Register CORS
    await server.register(fastifyCors, {
      origin: true
    })

    // Register tRPC
    await server.register(fastifyTRPCPlugin, {
      prefix: '/trpc',
      trpcOptions: { router: appRouter }
    })

    await server.listen({ host: '0.0.0.0', port: 3001 })
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

// Export type for frontend
export type AppRouter = typeof appRouter

start() 