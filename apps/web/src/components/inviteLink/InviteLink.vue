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

const isCopied = ref(false)
const baseUrl = ref('')

onMounted(() => {
  baseUrl.value = window.location.origin
})

const copyInviteLink = async () => {
  const inviteUrl = `${baseUrl.value}/signup?step=1`
  
  try {
    await navigator.clipboard.writeText(inviteUrl)
    isCopied.value = true
    
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>