import { ref } from 'vue';
import { subscribeToAuthChanges, signInAnonymously, getCurrentUser, isDJ } from '../firebase/auth';

// Shared auth state across all components
const user = ref(null);
const loading = ref(true);
const error = ref(null);

let unsubscribe = null;
let initialized = false;

// Initialize auth listener only once (immediately, not in onMounted)
const initAuth = async () => {
  if (initialized) return;
  initialized = true;

  try {
    // Subscribe to auth state changes
    unsubscribe = subscribeToAuthChanges(async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        user.value = firebaseUser;
        loading.value = false;
      } else {
        // No user signed in, sign in anonymously
        try {
          await signInAnonymously();
          // Auth state change will trigger this callback again
        } catch (err) {
          console.error('Failed to sign in anonymously:', err);
          error.value = err;
          loading.value = false;
        }
      }
    });
  } catch (err) {
    console.error('Error initializing auth:', err);
    error.value = err;
    loading.value = false;
  }
};

// Initialize immediately
initAuth();

/**
 * Composable for managing Firebase authentication state
 * Automatically signs in users anonymously if not authenticated
 */
export const useAuth = () => {

  // Computed properties for convenience
  const isAuthenticated = () => !!user.value;
  const isAdmin = () => isDJ();
  const userId = () => user.value?.uid || null;

  return {
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    userId
  };
};

/**
 * Cleanup function to be called when app unmounts
 */
export const cleanupAuth = () => {
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }
  initialized = false;
};
