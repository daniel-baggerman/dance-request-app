<template>
  <div class="min-h-screen bg-gray-50">
    <!-- PIN Entry Screen -->
    <div v-if="!isAuthenticated" class="min-h-screen flex items-center justify-center px-4">
      <div style="background: white; padding: 32px; border-radius: 16px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); max-width: 400px; width: 100%;">
        <h1 style="font-size: 24px; font-weight: 700; text-align: center; margin-bottom: 8px; color: #111827;">Admin Access</h1>
        <p style="text-align: center; color: #6b7280; margin-bottom: 24px;">Enter PIN to continue</p>
        
        <form @submit.prevent="handlePinSubmit">
          <input
            v-model="pinInput"
            type="password"
            inputmode="numeric"
            maxlength="4"
            placeholder="Enter 4-digit PIN"
            style="width: 100%; padding: 16px; border: 2px solid #d1d5db; border-radius: 8px; font-size: 18px; text-align: center; letter-spacing: 8px; font-weight: 600;"
            :style="pinError ? 'border-color: #ef4444;' : ''"
            autofocus
          />
          
          <p v-if="pinError" style="color: #ef4444; font-size: 14px; margin-top: 8px; text-align: center;">
            Incorrect PIN. Please try again.
          </p>
          
          <button
            type="submit"
            style="width: 100%; margin-top: 24px; padding: 16px; background: linear-gradient(to right, #9333ea, #7e22ce); color: white; border: none; border-radius: 12px; font-size: 16px; font-weight: 700; cursor: pointer;"
            :disabled="pinInput.length !== 4">
            Enter
          </button>
        </form>
      </div>
    </div>

    <!-- Admin Dashboard -->
    <div v-else>
      <!-- Header -->
      <header style="background: linear-gradient(to right, #9333ea, #7e22ce); color: white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <div style="max-width: 800px; margin: 0 auto; padding: 24px 16px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h1 style="font-size: 28px; font-weight: 700; margin: 0;">Admin Dashboard</h1>
            <p style="margin: 4px 0 0 0; opacity: 0.9; font-size: 14px;">Manage dance requests</p>
          </div>
          <button
            @click="handleLogout"
            style="padding: 8px 16px; background: rgba(255, 255, 255, 0.2); color: white; border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer;">
            Logout
          </button>
        </div>
      </header>

      <!-- Main Content -->
      <main style="max-width: 800px; margin: 0 auto; padding: 24px 16px;">
        <!-- Stats Card -->
        <div style="background: white; padding: 24px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); margin-bottom: 24px;">
          <h2 style="font-size: 18px; font-weight: 700; margin: 0 0 16px 0; color: #111827;">Queue Statistics</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px;">
            <div>
              <p style="font-size: 14px; color: #6b7280; margin: 0;">Total Requests</p>
              <p style="font-size: 32px; font-weight: 700; color: #9333ea; margin: 4px 0 0 0;">{{ totalRequests }}</p>
            </div>
            <div>
              <p style="font-size: 14px; color: #6b7280; margin: 0;">Total Upvotes</p>
              <p style="font-size: 32px; font-weight: 700; color: #9333ea; margin: 4px 0 0 0;">{{ totalUpvotes }}</p>
            </div>
          </div>
        </div>

        <!-- Actions Card -->
        <div style="background: white; padding: 24px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
          <h2 style="font-size: 18px; font-weight: 700; margin: 0 0 16px 0; color: #111827;">Queue Actions</h2>
          
          <!-- Seed Data Button -->
          <div style="border: 2px solid #dbeafe; background: #eff6ff; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
            <div style="display: flex; align-items: start; gap: 12px;">
              <svg style="width: 24px; height: 24px; color: #2563eb; flex-shrink: 0; margin-top: 2px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              <div style="flex: 1;">
                <p style="font-weight: 600; color: #1e40af; margin: 0 0 4px 0;">Add Sample Requests</p>
                <p style="font-size: 14px; color: #1e3a8a; margin: 0;">Add 5 Two Step dance requests to the queue for testing.</p>
              </div>
            </div>
          </div>

          <button
            @click="handleSeedData"
            :disabled="seeding"
            style="width: 100%; padding: 16px; background: #2563eb; color: white; border: none; border-radius: 12px; font-size: 16px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 16px;"
            :style="seeding ? 'opacity: 0.5; cursor: not-allowed;' : ''">
            <svg v-if="!seeding" style="width: 20px; height: 20px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            <span v-if="seeding">Adding Requests...</span>
            <span v-else>Add Sample Requests (5)</span>
          </button>
          
          <div style="border: 2px solid #fee2e2; background: #fef2f2; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
            <div style="display: flex; align-items: start; gap: 12px;">
              <svg style="width: 24px; height: 24px; color: #dc2626; flex-shrink: 0; margin-top: 2px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
              <div style="flex: 1;">
                <p style="font-weight: 600; color: #991b1b; margin: 0 0 4px 0;">Clear All Requests</p>
                <p style="font-size: 14px; color: #7f1d1d; margin: 0;">This will permanently delete all requests from the queue. This action cannot be undone.</p>
              </div>
            </div>
          </div>

          <button
            @click="handleClearQueue"
            :disabled="clearing || totalRequests === 0"
            style="width: 100%; padding: 16px; background: #dc2626; color: white; border: none; border-radius: 12px; font-size: 16px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;"
            :style="(clearing || totalRequests === 0) ? 'opacity: 0.5; cursor: not-allowed;' : ''">
            <svg v-if="!clearing" style="width: 20px; height: 20px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
            <span v-if="clearing">Clearing...</span>
            <span v-else-if="totalRequests === 0">No Requests to Clear</span>
            <span v-else>Clear All Requests ({{ totalRequests }})</span>
          </button>

          <p v-if="successMessage" style="margin-top: 16px; padding: 12px; background: #d1fae5; color: #065f46; border-radius: 8px; font-size: 14px; text-align: center;">
            {{ successMessage }}
          </p>

          <p v-if="errorMessage" style="margin-top: 16px; padding: 12px; background: #fee2e2; color: #991b1b; border-radius: 8px; font-size: 14px; text-align: center;">
            {{ errorMessage }}
          </p>
        </div>

        <!-- Back to Queue Link -->
        <div style="text-align: center; margin-top: 24px;">
          <a href="/" style="color: #9333ea; font-weight: 600; text-decoration: none;">
            ← Back to Request Queue
          </a>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRequests } from '../composables/useRequests'
import { clearAllRequests } from '../firebase/requests'
import { seedRequests } from '../firebase/seed'

const ADMIN_PIN = '6769'

// PIN Authentication
const isAuthenticated = ref(false)
const pinInput = ref('')
const pinError = ref(false)

// Admin state
const clearing = ref(false)
const seeding = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

// Get requests data
const { requests } = useRequests()

// Computed stats
const totalRequests = computed(() => requests.value.length)
const totalUpvotes = computed(() => {
  return requests.value.reduce((sum, req) => sum + (req.upvote_count || 0), 0)
})

// Handle PIN submission
const handlePinSubmit = () => {
  if (pinInput.value === ADMIN_PIN) {
    isAuthenticated.value = true
    pinError.value = false
    pinInput.value = ''
  } else {
    pinError.value = true
    pinInput.value = ''
  }
}

// Handle logout
const handleLogout = () => {
  isAuthenticated.value = false
  pinError.value = false
  pinInput.value = ''
}

// Handle seed data
const handleSeedData = async () => {
  seeding.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    await seedRequests()
    successMessage.value = '5 sample requests added successfully!'
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error) {
    console.error('Error seeding data:', error)
    errorMessage.value = 'Failed to add sample requests. Please try again.'
    
    // Clear error message after 5 seconds
    setTimeout(() => {
      errorMessage.value = ''
    }, 5000)
  } finally {
    seeding.value = false
  }
}

// Handle clear queue
const handleClearQueue = async () => {
  if (totalRequests.value === 0) return
  
  const confirmed = confirm(
    `Are you sure you want to delete all ${totalRequests.value} requests? This cannot be undone.`
  )
  
  if (!confirmed) return

  clearing.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    await clearAllRequests()
    successMessage.value = 'Queue cleared successfully!'
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error) {
    console.error('Error clearing queue:', error)
    errorMessage.value = 'Failed to clear queue. Please try again.'
    
    // Clear error message after 5 seconds
    setTimeout(() => {
      errorMessage.value = ''
    }, 5000)
  } finally {
    clearing.value = false
  }
}
</script>
