import { nanoid } from 'nanoid'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class InviteService {
  async createInvite(createdBy: string) {
    const code = nanoid(10)
    
    return await prisma.invite.create({
      data: {
        code,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        usedAt: null,
      }
    })
  }

  async markInviteAsUsed(code: string) {
    return await prisma.invite.update({
      where: { code },
      data: { usedAt: new Date() }
    })
  }

  async validateInvite(code: string) {
    const invite = await prisma.invite.findUnique({
      where: { code }
    })
    
    if (!invite) throw new Error('Invalid invite')
    if (invite.usedAt) throw new Error('Invite already used')
    if (invite.expiresAt && invite.expiresAt < new Date()) {
      throw new Error('Invite expired')
    }

    return invite
  }
}
