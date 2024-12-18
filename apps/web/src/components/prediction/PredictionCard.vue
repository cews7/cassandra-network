<script setup lang="ts">
defineProps<{
  prediction: {
    id: string
    content: string
    expectedDate: string
    status: string
    createdAt: string
  }
}>()
</script>

<template>
  <div class="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
    <div class="flex justify-between items-start">
      <h3 class="text-lg font-medium text-gray-900">{{ prediction.content }}</h3>
      <span 
        class="px-3 py-1 text-sm rounded-full"
        :class="{
          'bg-yellow-100 text-yellow-800': prediction.status === 'pending',
          'bg-green-100 text-green-800': prediction.status === 'validated',
          'bg-red-100 text-red-800': prediction.status === 'failed'
        }"
      >
        {{ prediction.status }}
      </span>
    </div>
    
    <div class="mt-2 space-y-1">
      <div class="text-sm text-gray-500">
        Expected: {{ new Date(prediction.expectedDate).toLocaleString() }}
      </div>
      <div class="text-sm text-gray-500">
        Created: {{ new Date(prediction.createdAt).toLocaleString() }}
      </div>
    </div>
    
    <div class="mt-3 pt-3 border-t border-gray-100">
      <NuxtLink 
        :to="`/predictions/${prediction.id}`"
        class="text-sm text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
      >
        View Details
      </NuxtLink>
    </div>
  </div>
</template> 