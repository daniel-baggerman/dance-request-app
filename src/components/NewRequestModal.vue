<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center z-50"
       @click.self="$emit('close')">
    <div class="bg-white rounded-t-3xl md:rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-slide-up">
      
      <!-- Header -->
      <div class="flex justify-between items-center p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900">New Request</h2>
        <button @click="$emit('close')" 
                class="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition">
          <svg style="width: 24px; height: 24px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Tab Navigation -->
      <div class="flex border-b border-gray-200">
        <button 
          @click="activeTab = 'browse'"
          class="flex-1 px-6 py-4 font-semibold transition-all"
          :class="activeTab === 'browse' 
            ? 'text-purple-600 border-b-2 border-purple-600' 
            : 'text-gray-500 hover:text-gray-700'">
          Browse Dances
        </button>
        <button 
          @click="activeTab = 'custom'"
          class="flex-1 px-6 py-4 font-semibold transition-all"
          :class="activeTab === 'custom' 
            ? 'text-purple-600 border-b-2 border-purple-600' 
            : 'text-gray-500 hover:text-gray-700'">
          Custom Request
        </button>
      </div>

      <!-- Tab Content -->
      <div class="flex-1 overflow-y-auto p-6">
        
        <!-- Browse Dances Tab -->
        <div v-if="activeTab === 'browse'" class="space-y-4">
          <!-- Search Bar -->
          <div class="relative">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search by dance or song name..."
              class="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
            <svg style="width: 20px; height: 20px; position: absolute; left: 12px; top: 14px;" class="text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>

          <!-- Dance List -->
          <div class="space-y-2">
            <button
              v-for="dance in filteredDances"
              :key="dance.id"
              @click="selectDance(dance)"
              class="w-full text-left p-4 border rounded-lg transition-all hover:border-purple-500 hover:bg-purple-50"
              :class="selectedDance?.id === dance.id ? 'border-purple-600 bg-purple-50' : 'border-gray-200'">
              <div class="font-semibold text-gray-900">{{ dance.danceName }}</div>
              <div class="text-sm text-gray-600">
                {{ dance.songTitle }} - {{ dance.artist }}
              </div>
              <div v-if="dance.lastRequested" class="text-xs text-gray-400 mt-1">
                Last requested: {{ dance.lastRequested }}
              </div>
            </button>

            <div v-if="filteredDances.length === 0" class="text-center py-8 text-gray-500">
              No dances found matching "{{ searchQuery }}"
            </div>
          </div>
        </div>

        <!-- Custom Request Tab -->
        <div v-if="activeTab === 'custom'" class="space-y-4">
          <p class="text-sm text-gray-600 mb-4">
            Can't find your dance in the list? Add it here!
          </p>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Dance Name <span class="text-gray-400 font-normal">(optional)</span>
            </label>
            <input 
              v-model="customRequest.danceName"
              type="text" 
              placeholder="e.g., Copperhead Road"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Song Title <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="customRequest.songTitle"
              type="text" 
              placeholder="e.g., Copperhead Road"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Artist <span class="text-gray-400 font-normal">(optional)</span>
            </label>
            <input 
              v-model="customRequest.artist"
              type="text" 
              placeholder="e.g., Steve Earle"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
          </div>
        </div>
      </div>

      <!-- Footer with Submit Button -->
      <div class="p-6 border-t border-gray-200">
        <button 
          @click="submitRequest"
          :disabled="!canSubmit"
          class="w-full py-4 rounded-lg font-bold text-lg transition-all"
          :class="canSubmit 
            ? 'bg-purple-600 text-white hover:bg-purple-700 active:scale-95' 
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'">
          Submit Request
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

defineEmits(['close', 'submit'])

// Mock dance list data
const danceList = ref([
  { id: 1, danceName: 'Copperhead Road', songTitle: 'Copperhead Road', artist: 'Steve Earle', lastRequested: '3 days ago' },
  { id: 2, danceName: 'Boot Scootin\' Boogie', songTitle: 'Boot Scootin\' Boogie', artist: 'Brooks & Dunn', lastRequested: '1 week ago' },
  { id: 3, danceName: 'Electric Slide', songTitle: 'Electric Boogie', artist: 'Marcia Griffiths', lastRequested: '2 days ago' },
  { id: 4, danceName: 'Cupid Shuffle', songTitle: 'Cupid Shuffle', artist: 'Cupid', lastRequested: null },
  { id: 5, danceName: 'Watermelon Crawl', songTitle: 'Watermelon Crawl', artist: 'Tracy Byrd', lastRequested: '5 days ago' },
  { id: 6, danceName: 'Tush Push', songTitle: 'Tush', artist: 'ZZ Top', lastRequested: '1 day ago' },
  { id: 7, danceName: 'Cowboy Boogie', songTitle: 'Footloose', artist: 'Blake Shelton', lastRequested: null },
  { id: 8, danceName: 'Wobble', songTitle: 'Wobble', artist: 'V.I.C.', lastRequested: '4 hours ago' }
])

const activeTab = ref('browse')
const searchQuery = ref('')
const selectedDance = ref(null)
const customRequest = ref({
  danceName: '',
  songTitle: '',
  artist: ''
})

const filteredDances = computed(() => {
  if (!searchQuery.value) return danceList.value
  
  const query = searchQuery.value.toLowerCase()
  return danceList.value.filter(dance => 
    dance.danceName.toLowerCase().includes(query) ||
    dance.songTitle.toLowerCase().includes(query) ||
    dance.artist.toLowerCase().includes(query)
  )
})

const canSubmit = computed(() => {
  if (activeTab.value === 'browse') {
    return selectedDance.value !== null
  } else {
    return customRequest.value.songTitle.trim() !== ''
  }
})

const selectDance = (dance) => {
  selectedDance.value = dance
}

const submitRequest = () => {
  if (!canSubmit.value) return
  
  // Placeholder for actual submission logic
  console.log('Submitting request:', activeTab.value === 'browse' ? selectedDance.value : customRequest.value)
  
  // Reset form
  selectedDance.value = null
  customRequest.value = { danceName: '', songTitle: '', artist: '' }
  searchQuery.value = ''
}
</script>

<style scoped>
@keyframes slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}
</style>
