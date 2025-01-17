<template>
  <div>
    <button
      @click="copyInviteLink"
      :class="[
        'inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
        isCopied 
          ? 'bg-green-500 hover:bg-green-600 text-white'
          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
      ]"
    >
      <span v-if="!isCopied">Invite Future Seer</span>
      <span v-else>Copied!</span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { nanoid } from 'nanoid'

const { $client } = useNuxtApp()
const isCopied = ref(false)
const baseUrl = ref('')

onMounted(() => {
  baseUrl.value = window.location.origin
})

const generateInviteCode = () => {
  return nanoid(10)
}

const saveInviteCode = async (inviteCode) => {
  try {
    const result = await $client.invite.create.mutate({
      code: inviteCode,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    })
    return result.success
  } catch (error) {
    console.error('Failed to save invite code:', error)
    return false
  }
}

const copyInviteLink = async () => {
  const inviteCode = generateInviteCode()
  const inviteUrl = `${baseUrl.value}/signup?step=1&invite=${inviteCode}`
  
  try {
    await navigator.clipboard.writeText(inviteUrl)
    const saved = await saveInviteCode(inviteCode)
    
    if (!saved) {
      throw new Error('Failed to save invite code')
    }
    
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy or save:', err)
  }
}
</script>