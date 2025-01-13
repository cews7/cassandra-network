import { FastifyInstance } from 'fastify'
import { SignupService } from '../services/signupService'
import { InviteService } from '../services/inviteService'

interface SignupBody {
  email: string
  password: string
  inviteCode: string
}

export async function signupRoutes(app: FastifyInstance) {
  const signupService = new SignupService(
    app.supabase,
    new InviteService()
  )

  app.post<{ Body: SignupBody }>('/signup', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'password', 'inviteCode'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 8 },
          inviteCode: { type: 'string' }
        }
      }
    },
    handler: async (request, reply) => {
      const { email, password, inviteCode } = request.body
      
      try {
        const user = await signupService.registerWithInvite(
          email,
          password,
          inviteCode
        )
        
        return reply.code(201).send(user)
      } catch (error: any) {
        // Handle specific errors with appropriate status codes
        if (error.message === 'Invalid invite' || 
            error.message === 'Invite already used' ||
            error.message === 'Invite expired') {
          return reply.code(400).send({ error: error.message })
        }
        
        throw error // Let fastify error handler deal with other errors
      }
    }
  })
}