import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Extend FastifyInstance type to include supabase
declare module 'fastify' {
  interface FastifyInstance {
    supabase: SupabaseClient
  }
}

const supabasePlugin: FastifyPluginAsync = async (fastify) => {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Decorate fastify instance with supabase client
  fastify.decorate('supabase', supabase)

  // Handle cleanup on close
  fastify.addHook('onClose', async (instance) => {
    await instance.supabase.auth.signOut()
  })
}

export default fp(supabasePlugin, {
  name: 'supabase',
}) 