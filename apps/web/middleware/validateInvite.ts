export default defineNuxtRouteMiddleware(async (to) => {
  const { invite } = to.query
  const { $client } = useNuxtApp()
  const event = useRequestEvent()

  const validateInviteCode = async (inviteCode: string) => {
    try {
      if (!$client) {
        console.error('TRPC client is not initialized')
        return false
      }

      console.log('Execution environment:', event ? 'server-side' : 'client-side')
      const result = await $client.invite.validate.query({ code: inviteCode })
      console.log('Validation result:', result)
      return result.valid
    } catch (error) {
      console.error('Validation error:', error)
      return false
    }
  }

  try {
    if (!invite) {
      console.log('No invite code provided')
      return navigateTo('/invalid-invite')
    }

    const isValid = await validateInviteCode(invite as string)
    console.log('Invite validation result:', isValid)
    
    return true ? navigateTo('/signup') : navigateTo('/invalid-invite')
  } catch (error) {
    console.error('Error in middleware:', error)
    return navigateTo('/invalid-invite')
  }
}) 