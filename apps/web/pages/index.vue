<script setup lang="ts">
import PredictionForm from '~/src/components/prediction/PredictionForm.vue'
import PredictionList from '~/src/components/prediction/PredictionList.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-3xl mx-auto px-4 space-y-8">
      <header>
        <h1 class="text-3xl font-bold text-gray-900 text-center">Predictions</h1>
        <p class="mt-2 text-center text-gray-600">Submit and track predictions about future events</p>
      </header>

      <PredictionForm class="mb-8" />
      <PredictionList />
    </div>
  </div>
</template> 