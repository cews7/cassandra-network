<!-- components/AppNavbar.vue -->
<template>
  <nav class="border-b border-gray-200 bg-white">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 justify-between">
        <div class="flex">
          <div class="flex flex-shrink-0 items-center">
            <NuxtLink to="/" class="text-xl font-bold">Cassandra Network</NuxtLink>
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <InviteLink />

          <div class="relative">
            <button
              type="button"
              class="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <Icon 
                name="heroicons:user-circle" 
                class="h-8 w-8 text-gray-400" 
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import InviteLink from '../inviteLink/InviteLink.vue'
</script>
