<template>
  <!-- Dark overlay backdrop -->
  <div style="position: fixed; inset: 0; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 50;"
       @click.self="$emit('close')">
    <!-- Modal content -->
    <div style="background: white; border-radius: 16px; padding: 32px; max-width: 500px; width: 90%; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); animation: slideUp 0.3s ease-out;">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <h2 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0;">
          Request a Dance
        </h2>
        <button @click="$emit('close')" 
                style="background: none; border: none; cursor: pointer; padding: 8px; border-radius: 50%; transition: background 0.2s;"
                @mouseover="$event.target.style.background = '#f3f4f6'"
                @mouseleave="$event.target.style.background = 'transparent'">
          <svg style="width: 24px; height: 24px; color: #6b7280;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <!-- Form -->
      <form @submit.prevent="handleSubmit" style="display: flex; flex-direction: column; gap: 20px;">
        <!-- Dance Name (Required) -->
        <div>
          <label style="display: block; font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 8px;">
            Dance Name <span style="color: #ef4444;">*</span>
          </label>
          <input 
            v-model="formData.dance_name"
            type="text" 
            required
            placeholder="e.g., Copperhead Road"
            style="width: 100%; padding: 12px; border: 2px solid #d1d5db; border-radius: 8px; font-size: 16px; transition: border-color 0.2s;"
            @focus="$event.target.style.borderColor = '#9333ea'"
            @blur="$event.target.style.borderColor = '#d1d5db'">
        </div>

        <!-- Song Name (Optional) -->
        <div>
          <label style="display: block; font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 8px;">
            Song Name
          </label>
          <input 
            v-model="formData.song_title"
            type="text" 
            placeholder="e.g., Copperhead Road"
            style="width: 100%; padding: 12px; border: 2px solid #d1d5db; border-radius: 8px; font-size: 16px; transition: border-color 0.2s;"
            @focus="$event.target.style.borderColor = '#9333ea'"
            @blur="$event.target.style.borderColor = '#d1d5db'">
        </div>

        <!-- Artist (Optional) -->
        <div>
          <label style="display: block; font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 8px;">
            Artist
          </label>
          <input 
            v-model="formData.artist"
            type="text" 
            placeholder="e.g., Steve Earle"
            style="width: 100%; padding: 12px; border: 2px solid #d1d5db; border-radius: 8px; font-size: 16px; transition: border-color 0.2s;"
            @focus="$event.target.style.borderColor = '#9333ea'"
            @blur="$event.target.style.borderColor = '#d1d5db'">
        </div>

        <!-- Submit Button -->
        <button 
          type="submit"
          style="width: 100%; padding: 16px; background: linear-gradient(to right, #9333ea, #7e22ce); color: white; border: none; border-radius: 12px; font-size: 16px; font-weight: 700; cursor: pointer; transition: transform 0.1s; margin-top: 8px;"
          @mouseover="$event.target.style.transform = 'scale(1.02)'"
          @mouseleave="$event.target.style.transform = 'scale(1)'">
          Submit Request
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['close', 'submit'])

const formData = ref({
  dance_name: '',
  song_title: '',
  artist: ''
})

const handleSubmit = () => {
  emit('submit', {
    dance_name: formData.value.dance_name,
    song_title: formData.value.song_title || formData.value.dance_name,
    artist: formData.value.artist,
    upvote_count: 0,
    status: 'pending',
    timestamp: new Date()
  })
  
  // Reset form
  formData.value = {
    dance_name: '',
    song_title: '',
    artist: ''
  }
}
</script>

<style scoped>
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
