import { ref, onMounted, onUnmounted } from 'vue';
import { subscribeToRequests, createRequest, upvoteRequest } from '../firebase/requests';
import { useAuth } from './useAuth';

export function useRequests() {
  const requests = ref([]);
  const loading = ref(true);
  const error = ref(null);
  let unsubscribe = null;

  // Get user ID from Firebase Auth
  const { userId } = useAuth();

  onMounted(() => {
    // Subscribe to real-time updates
    unsubscribe = subscribeToRequests((updatedRequests) => {
      requests.value = updatedRequests;
      loading.value = false;
    });
  });

  onUnmounted(() => {
    // Clean up subscription
    if (unsubscribe) {
      unsubscribe();
    }
  });

  const addRequest = async (requestData) => {
    try {
      error.value = null;
      const requestId = await createRequest(requestData);
      return requestId;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  const handleUpvote = async (requestId) => {
    try {
      error.value = null;
      
      const currentUserId = userId();
      if (!currentUserId) {
        throw new Error('User not authenticated');
      }
      
      // Check if already upvoted (optimistic check)
      const request = requests.value.find(r => r.id === requestId);
      if (request && request.upvoted_by && request.upvoted_by.includes(currentUserId)) {
        return; // Already upvoted
      }
      
      await upvoteRequest(requestId, currentUserId);
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  // Check if current user has upvoted a request
  const isUpvoted = (request) => {
    const currentUserId = userId();
    return currentUserId && request.upvoted_by && request.upvoted_by.includes(currentUserId);
  };

  return {
    requests,
    loading,
    error,
    addRequest,
    handleUpvote,
    isUpvoted
  };
}
