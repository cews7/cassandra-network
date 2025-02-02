import { nanoid } from 'nanoid'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class InviteService {
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
