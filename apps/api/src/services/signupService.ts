import { SupabaseClient } from '@supabase/supabase-js'
import { PrismaClient } from '@prisma/client'
import { nanoid } from 'nanoid'
import { InviteService } from './inviteService'

const prisma = new PrismaClient()

export class SignupService {
  constructor(
    private supabase: SupabaseClient,
    private inviteService: InviteService
  ) {}

  async registerWithInvite(email: string, password: string, inviteCode: string) {
    // 1. Validate invite first
    await this.inviteService.validateInvite(inviteCode)

    // 2. Create Supabase auth user
    const { data: authData, error } = await this.supabase.auth.signUp({
      email,
      password
    })
    if (error) throw error

    // 3. Create user in our database
    const userId = nanoid()
    const user = await prisma.user.create({
      data: {
        id: userId,
        email,
        providerId: authData.user?.id,
      }
    })

    // 4. Mark invite as used
    await this.inviteService.markInviteAsUsed(inviteCode)
    await this.inviteService.validateInvite(inviteCode)

    return { userId, supabaseId: authData.user?.id }
  }
}