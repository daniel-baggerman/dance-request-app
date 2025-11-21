<template>
  <div style="background: white; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px;">
    <!-- Left: Stacked content -->
    <div style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px;">
      <!-- Dance Name -->
      <h3 style="font-size: 16px; font-weight: 700; line-height: 1.2; margin: 0; color: #111827;">
        {{ request.dance_name }}
      </h3>
      
      <!-- Song Name and Artist on same line -->
      <p style="font-size: 14px; line-height: 1.3; margin: 0; color: #6b7280;">
        {{ request.song_title }}
        <span v-if="request.artist"> • {{ request.artist }}</span>
      </p>
    </div>

    <!-- Right: Time and Heart button -->
    <div style="display: flex; align-items: center; gap: 12px;">
      <!-- Request Time -->
      <p style="font-size: 12px; line-height: 1.2; margin: 0; color: #9ca3af; white-space: nowrap;">
        {{ formattedTime }}
      </p>
      <button 
        @click="$emit('upvote')"
        style="display: flex; align-items: center; justify-content: flex-end; gap: 6px; background: none; border: none; cursor: pointer; padding: 8px; min-width: 70px; min-height: 44px; flex-shrink: 0;"
        :disabled="isUpvoted">
        <svg style="width: 24px; height: 24px;" :class="isUpvoted ? 'fill-pink-500' : 'fill-gray-400 hover:fill-pink-400'" 
             viewBox="0 0 24 24">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
        </svg>
        <span style="font-size: 16px; font-weight: 600; color: #374151; min-width: 24px; text-align: right;">{{ request.upvote_count }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  request: {
    type: Object,
    required: true
  },
  isUpvoted: {
    type: Boolean,
    default: false
  },
  showSource: {
    type: Boolean,
    default: false
  }
})

defineEmits(['upvote'])

const formattedTime = computed(() => {
  if (!props.request.timestamp) return ''
  try {
    const date = new Date(props.request.timestamp)
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  } catch (e) {
    return ''
  }
})
</script>
