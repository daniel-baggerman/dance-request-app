import { db } from './config';
import { 
  collection, 
  addDoc, 
  updateDoc,
  doc,
  query,
  onSnapshot,
  serverTimestamp,
  arrayUnion,
  increment,
  orderBy
} from 'firebase/firestore';

const requestsCollection = collection(db, 'requests');

/**
 * Subscribe to real-time request updates
 * @param {Function} callback - Called with updated requests array
 * @returns {Function} Unsubscribe function
 */
export const subscribeToRequests = (callback) => {
  const q = query(
    requestsCollection,
    orderBy('timestamp', 'desc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const requests = [];
    snapshot.forEach((docSnap) => {
      requests.push({
        id: docSnap.id,
        ...docSnap.data(),
        timestamp: docSnap.data().timestamp?.toDate() || new Date(),
      });
    });
    callback(requests);
  }, (error) => {
    console.error('Error fetching requests:', error);
    callback([]);
  });
};

/**
 * Create a new request
 */
export const createRequest = async (requestData) => {
  try {
    const docRef = await addDoc(requestsCollection, {
      dance_name: requestData.dance_name,
      song_title: requestData.song_title || requestData.dance_name,
      artist: requestData.artist || '',
      upvote_count: 0,
      upvoted_by: [],
      status: 'pending',
      timestamp: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating request:', error);
    throw error;
  }
};

/**
 * Upvote a request
 * @param {string} requestId - The request document ID
 * @param {string} sessionId - The user's session ID for tracking
 */
export const upvoteRequest = async (requestId, sessionId) => {
  try {
    const requestRef = doc(db, 'requests', requestId);
    await updateDoc(requestRef, {
      upvote_count: increment(1),
      upvoted_by: arrayUnion(sessionId)
    });
  } catch (error) {
    console.error('Error upvoting request:', error);
    throw error;
  }
};

/**
 * Update request status
 */
export const updateRequestStatus = async (requestId, status) => {
  try {
    const requestRef = doc(db, 'requests', requestId);
    await updateDoc(requestRef, {
      status: status
    });
  } catch (error) {
    console.error('Error updating request status:', error);
    throw error;
  }
};

/**
 * Clear all requests (Admin only)
 * Deletes all documents in the requests collection
 */
export const clearAllRequests = async () => {
  try {
    const { getDocs, deleteDoc } = await import('firebase/firestore');
    
    const snapshot = await getDocs(requestsCollection);
    
    const deletePromises = [];
    snapshot.forEach((docSnap) => {
      deletePromises.push(deleteDoc(docSnap.ref));
    });
    
    await Promise.all(deletePromises);
    console.log(`Cleared ${deletePromises.length} requests from queue`);
  } catch (error) {
    console.error('Error clearing all requests:', error);
    throw error;
  }
};
