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
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-500 text-lg">Loading requests...</p>
      </div>
      <div v-else-if="requests.length === 0" class="text-center py-12">
        <svg style="width: 64px; height: 64px; margin: 0 auto 16px;" class="text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
        </svg>
        <p class="text-gray-500 text-lg">No requests yet</p>
        <p class="text-gray-400 text-sm mt-1">Be the first to request a dance!</p>
      </div>

      <div v-else style="border-top: 2px solid black;">
        <!-- Request Cards -->
        <RequestCard
          v-for="(request, index) in sortedRequests"
          :key="request.id"
          :request="request"
          :isUpvoted="isUpvoted(request)"
          :class="{ 'border-t-2 border-black': index > 0 }"
          @upvote="handleUpvote(request.id)"
        />
      </div>
    </main>

    <!-- Sort Dropdown Menu -->
    <div v-if="showSortMenu" 
         @click.self="showSortMenu = false"
         style="position: fixed; inset: 0; z-index: 30; background: rgba(0, 0, 0, 0.3);">
      <div style="position: fixed; bottom: 88px; right: 16px; background: white; border-radius: 12px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2); overflow: hidden; min-width: 200px;">
        <button
          @click="selectSort('dance')"
          style="width: 100%; padding: 16px; border: none; background: white; text-align: left; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; transition: background 0.1s;"
          :style="sortMode === 'dance' ? 'background: #f3f4f6; font-weight: 700;' : ''"
          @mouseover="$event.target.style.background = '#f9fafb'"
          @mouseleave="$event.target.style.background = sortMode === 'dance' ? '#f3f4f6' : 'white'">
          <span>Dance Name</span>
          <svg v-if="sortMode === 'dance'" style="width: 20px; height: 20px; color: #9333ea;" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        </button>
        <div style="height: 1px; background: #e5e7eb; margin: 0 16px;"></div>
        
        <button
          @click="selectSort('song')"
          style="width: 100%; padding: 16px; border: none; background: white; text-align: left; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; transition: background 0.1s;"
          :style="sortMode === 'song' ? 'background: #f3f4f6; font-weight: 700;' : ''"
          @mouseover="$event.target.style.background = '#f9fafb'"
          @mouseleave="$event.target.style.background = sortMode === 'song' ? '#f3f4f6' : 'white'">
          <span>Song Name</span>
          <svg v-if="sortMode === 'song'" style="width: 20px; height: 20px; color: #9333ea;" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        </button>
        <div style="height: 1px; background: #e5e7eb; margin: 0 16px;"></div>
        
        <button
          @click="selectSort('artist')"
          style="width: 100%; padding: 16px; border: none; background: white; text-align: left; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; transition: background 0.1s;"
          :style="sortMode === 'artist' ? 'background: #f3f4f6; font-weight: 700;' : ''"
          @mouseover="$event.target.style.background = '#f9fafb'"
          @mouseleave="$event.target.style.background = sortMode === 'artist' ? '#f3f4f6' : 'white'">
          <span>Artist Name</span>
          <svg v-if="sortMode === 'artist'" style="width: 20px; height: 20px; color: #9333ea;" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        </button>
        <div style="height: 1px; background: #e5e7eb; margin: 0 16px;"></div>
        
        <button
          @click="selectSort('likes')"
          style="width: 100%; padding: 16px; border: none; background: white; text-align: left; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; transition: background 0.1s;"
          :style="sortMode === 'likes' ? 'background: #f3f4f6; font-weight: 700;' : ''"
          @mouseover="$event.target.style.background = '#f9fafb'"
          @mouseleave="$event.target.style.background = sortMode === 'likes' ? '#f3f4f6' : 'white'">
          <span>Likes</span>
          <svg v-if="sortMode === 'likes'" style="width: 20px; height: 20px; color: #9333ea;" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        </button>
        <div style="height: 1px; background: #e5e7eb; margin: 0 16px;"></div>
        <button
          @click="selectSort('time')"
          style="width: 100%; padding: 16px; border: none; background: white; text-align: left; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; transition: background 0.1s;"
          :style="sortMode === 'time' ? 'background: #f3f4f6; font-weight: 700;' : ''"
          @mouseover="$event.target.style.background = '#f9fafb'"
          @mouseleave="$event.target.style.background = sortMode === 'time' ? '#f3f4f6' : 'white'">
          <span>Request Time</span>
          <svg v-if="sortMode === 'time'" style="width: 20px; height: 20px; color: #9333ea;" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Fixed Bottom Action Buttons -->
    <div style="position: fixed; bottom: 0; left: 0; right: 0; background: white; border-top: 2px solid #e5e7eb; padding: 12px 16px; display: flex; gap: 12px; z-index: 20; box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1);">
      <button 
        @click="showNewRequestModal = true"
        style="flex: 1; background: linear-gradient(to right, #9333ea, #7e22ce); color: white; padding: 16px; border-radius: 12px; border: none; font-size: 16px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); transition: transform 0.1s;">
        <svg style="width: 20px; height: 20px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        New Request
      </button>
      
      <button 
        @click="showSortMenu = !showSortMenu"
        style="flex: 1; background: white; color: #374151; padding: 16px; border-radius: 12px; border: 2px solid #d1d5db; font-size: 16px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.1s;">
        <svg style="width: 20px; height: 20px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"/>
        </svg>
        Sort
      </button>
    </div>

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
import { useRequests } from '../composables/useRequests'

// Use Firebase for requests
const { requests, loading, error, addRequest, handleUpvote: upvoteRequest, isUpvoted } = useRequests()

const showNewRequestModal = ref(false)
const showSortMenu = ref(false)
const sortMode = ref('likes') // 'dance', 'song', 'artist', 'likes', or 'time'

const pendingRequestsCount = computed(() => {
  return requests.value.filter(r => r.status === 'pending').length
})

const sortedRequests = computed(() => {
  const list = [...requests.value]
  switch (sortMode.value) {
    case 'dance':
      return list.sort((a, b) => a.dance_name.localeCompare(b.dance_name))
    case 'song':
      return list.sort((a, b) => a.song_title.localeCompare(b.song_title))
    case 'artist':
      return list.sort((a, b) => a.artist.localeCompare(b.artist))
    case 'time':
      return list.sort((a, b) => b.timestamp - a.timestamp)
    case 'likes':
    default:
      return list.sort((a, b) => b.upvote_count - a.upvote_count || a.dance_name.localeCompare(b.dance_name))
  }
})

const selectSort = (mode) => {
  sortMode.value = mode
  showSortMenu.value = false
}

const handleUpvote = async (requestId) => {
  try {
    await upvoteRequest(requestId)
  } catch (err) {
    console.error('Failed to upvote:', err)
  }
}

const handleNewRequest = async (requestData) => {
  try {
    await addRequest(requestData)
    showNewRequestModal.value = false
  } catch (err) {
    console.error('Failed to create request:', err)
    alert('Failed to submit request. Please try again.')
  }
}
</script>
