import { z } from 'zod'
import { publicProcedure, router } from '../trpc'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const inviteRouter = router({
  create: publicProcedure
    .input(z.object({
      code: z.string(),
      createdAt: z.coerce.date(),
      expiresAt: z.coerce.date(),
    }))
    .mutation(async ({ input }) => {
      try {
        const invite = await prisma.invite.create({
          data: {
            code: input.code,
            createdAt: input.createdAt,
            expiresAt: input.expiresAt,
            // createdById: ctx.user?.id  // Uncomment this if you want to track who created it
          }
        })
        
        console.log('Created invite:', invite)
        
        return {
          success: true,
          invite
        }
      } catch (error) {
        console.error('Failed to create invite:', error)
        throw error
      }
    }),
  validate: publicProcedure
    .input(z.object({
      code: z.string()
    }))

    .query(async ({ input }) => {
      console.log('Received validate request for code:', input.code)
      try {
        const invite = await prisma.invite.findFirst({
          where: {
            code: input.code,
            expiresAt: {
              gt: new Date()
            },
            usedAt: null
          }
        })
        console.log('Invite lookup result:', invite)
        return {
          valid: Boolean(invite),
          error: null
        }
      } catch (error) {
        console.error('Database error while validating invite:', error)
        return {
          valid: false,
          error: 'Failed to validate invite code'
        }
      }
    })
})