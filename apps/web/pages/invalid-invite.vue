<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4">
    <h1 class="text-2xl font-bold mb-4">Invalid Invite Code</h1>
    <p class="text-gray-600 mb-4">
      The invite code you used is invalid or has expired.
    </p>
    <p class="text-gray-600">
      Please contact the person who invited you for a new invite code.
    </p>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default'
})
</script> 