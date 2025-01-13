import Fastify from 'fastify'
import { signupRoutes } from './routes/signup'
import supabasePlugin from './plugins/supabase'

export async function build(opts: { testing: boolean } = { testing: false }) {
  const fastify = Fastify({
    logger: opts.testing ? false : true
  })
  
  await fastify.register(supabasePlugin)
  await fastify.register(signupRoutes)
  
  // Only listen if we're not testing
  if (!opts.testing) {
    await fastify.listen({ port: 3000 })
  }
  
  return fastify
}

// Check if this file is being run directly
  const start = async () => {
    try {
      const server = await build()
      await server.listen({ port: 3000 })
      console.log('Server listening on port 3000')
    } catch (err) {
      console.error(err)
      process.exit(1)
    }
  }

  if (require.main === module) {
    start()
  }
  