<script setup>
import { useAuth } from './composables/useAuth'
import RequestQueue from './components/RequestQueue.vue'

// Initialize authentication (auto sign-in anonymously)
const { loading: authLoading } = useAuth()
</script>

<template>
  <div v-if="authLoading" class="flex items-center justify-center min-h-screen">
    <p class="text-gray-500 text-lg">Initializing...</p>
  </div>
  <RequestQueue v-else />
</template>
