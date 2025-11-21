<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-linear-to-r from-purple-600 to-purple-800 text-white shadow-lg sticky top-0 z-10">
      <div class="max-w-4xl mx-auto px-4 py-6">
        <h1 style="font-size: 32px; font-weight: 700; text-align: center; margin: 0;">Dance Requests</h1>
      </div>
    </header>

    <!-- Request Queue List -->
    <main style="max-width: 100%; padding: 0; padding-bottom: 96px;">
      <div v-if="requests.length === 0" class="text-center py-12">
        <svg style="width: 64px; height: 64px; margin: 0 auto 16px;" class="text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
        </svg>
        <p class="text-gray-500 text-lg">No requests yet</p>
        <p class="text-gray-400 text-sm mt-1">Be the first to request a dance!</p>
      </div>

      <div v-else style="border-top: 2px solid black;">
        <!-- Request Cards -->
        <RequestCard
          v-for="(request, index) in requests"
          :key="request.id"
          :request="request"
          :isUpvoted="upvotedRequests.includes(request.id)"
          :class="{ 'border-t-2 border-black': index > 0 }"
          @upvote="handleUpvote(request.id)"
        />
      </div>
    </main>

    <!-- New Request Modal -->
    <NewRequestModal
      v-if="showNewRequestModal"
      @close="showNewRequestModal = false"
      @submit="handleNewRequest"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import RequestCard from './RequestCard.vue'
import NewRequestModal from './NewRequestModal.vue'

// Mock data for wireframe
const requests = ref([
  {
    id: 1,
    danceName: 'Copperhead Road',
    songTitle: 'Copperhead Road',
    artist: 'Steve Earle',
    upvoteCount: 12,
    status: 'pending',
    timestamp: new Date()
  },
  {
    id: 2,
    customDanceName: 'Electric Slide',
    customSongTitle: 'Electric Boogie',
    customArtist: 'Marcia Griffiths',
    upvoteCount: 8,
    status: 'added_to_playlist',
    timestamp: new Date()
  },
  {
    id: 3,
    danceName: 'Boot Scootin\' Boogie',
    songTitle: 'Boot Scootin\' Boogie',
    artist: 'Brooks & Dunn',
    upvoteCount: 15,
    status: 'pending',
    timestamp: new Date()
  },
  {
    id: 4,
    customDanceName: 'Wobble',
    customSongTitle: 'Wobble',
    customArtist: 'V.I.C.',
    upvoteCount: 5,
    status: 'pending',
    timestamp: new Date()
  }
])

const upvotedRequests = ref([2]) // User has upvoted request #2
const showNewRequestModal = ref(false)

const pendingRequestsCount = computed(() => {
  return requests.value.filter(r => r.status === 'pending').length
})

const handleUpvote = (requestId) => {
  if (!upvotedRequests.value.includes(requestId)) {
    upvotedRequests.value.push(requestId)
    const request = requests.value.find(r => r.id === requestId)
    if (request) {
      request.upvoteCount++
    }
  }
}

const handleNewRequest = (requestData) => {
  // Placeholder for handling new request submission
  console.log('New request submitted:', requestData)
  showNewRequestModal.value = false
}
</script>
