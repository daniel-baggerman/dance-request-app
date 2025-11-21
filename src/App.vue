<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from './composables/useAuth'
import RequestQueue from './components/RequestQueue.vue'
import AdminView from './components/AdminView.vue'

// Initialize authentication (auto sign-in anonymously)
const { loading: authLoading } = useAuth()

// Simple client-side routing
const currentPath = ref(window.location.pathname)

const currentView = computed(() => {
  if (currentPath.value === '/admin') {
    return 'admin'
  }
  return 'queue'
})

// Update route on popstate (browser back/forward)
onMounted(() => {
  window.addEventListener('popstate', () => {
    currentPath.value = window.location.pathname
  })
})
</script>

<template>
  <div v-if="authLoading" class="flex items-center justify-center min-h-screen">
    <p class="text-gray-500 text-lg">Initializing...</p>
  </div>
  <AdminView v-else-if="currentView === 'admin'" />
  <RequestQueue v-else />
</template>
