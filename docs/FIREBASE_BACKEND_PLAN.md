# Firebase Backend Implementation Plan

**Date:** November 20, 2025  
**Status:** Planning Phase  
**Goal:** Replace mock data with persistent Firebase Firestore backend

---

## Table of Contents

1. [Overview](#overview)
2. [Current State Analysis](#current-state-analysis)
3. [Firestore Database Design](#firestore-database-design)
4. [Security Rules Design](#security-rules-design)
5. [Service Layer Architecture](#service-layer-architecture)
6. [Implementation Phases](#implementation-phases)
7. [Migration Strategy](#migration-strategy)
8. [Testing Strategy](#testing-strategy)
9. [Rollback Plan](#rollback-plan)

---

## Overview

### Objectives

1. **Replace Mock Data** with real-time Firestore database
2. **Implement Session Management** for dancers and DJ authentication
3. **Enable Real-Time Updates** across all connected clients
4. **Persist Upvotes** to prevent duplicate voting after refresh
5. **Add DJ Admin Features** for managing requests and dance library

### Key Requirements from Project Outline

- **Real-time updates** for queue and upvotes
- **Anonymous dancer access** with session tracking
- **DJ authentication** with admin privileges
- **Request persistence** across page refreshes
- **Dance library management** (Phase 2)
- **Session-based upvote tracking** to prevent duplicates

---

## Current State Analysis

### What We Have

**Components:**
- `RequestQueue.vue` - Main view with mock data array
- `RequestCard.vue` - Display component
- `NewRequestModal.vue` - Form for submitting requests

**Mock Data Structure:**
```javascript
{
  id: Number,
  dance_name: String,
  song_title: String,
  artist: String,
  upvote_count: Number,
  status: String,
  timestamp: Date
}
```

**Current State Management:**
- Local reactive refs in `RequestQueue.vue`
- No persistence (data lost on refresh)
- No session tracking for upvotes
- No authentication

**Firebase Setup:**
- Firebase project initialized
- Config file exists (`src/firebase/config.js`)
- Firestore and Auth imported but not used

### What We Need

1. **Firestore Collections** for requests and dances
2. **Real-time Listeners** to sync data across clients
3. **Session Management** using localStorage + Firebase Anonymous Auth
4. **Service Layer** to abstract Firebase operations
5. **Security Rules** to protect data
6. **DJ Authentication** for admin actions
7. **Composables** for reusable Firebase logic

---

## Firestore Database Design

### Collection Structure

```
firestore
├── requests (collection)
│   └── {requestId} (auto-generated document ID)
│       ├── dance_name: string
│       ├── song_title: string
│       ├── artist: string
│       ├── upvote_count: number
│       ├── upvoted_by: array<string>  // Session IDs
│       ├── status: string             // 'pending' | 'added_to_playlist' | 'played'
│       ├── timestamp: timestamp
│       ├── created_at: timestamp
│       ├── completed_at: timestamp | null
│       └── created_by: string         // Session ID
│
├── dances (collection) - Phase 2
│   └── {danceId} (auto-generated document ID)
│       ├── dance_name: string
│       ├── song_title: string
│       ├── artist: string
│       ├── last_requested: timestamp | null
│       ├── created_at: timestamp
│       └── request_count: number
│
└── sessions (collection) - For tracking
    └── {sessionId} (custom ID)
        ├── created_at: timestamp
        ├── last_active: timestamp
        ├── user_type: string          // 'dancer' | 'dj'
        └── upvoted_requests: array<string>
```

### Document Schemas

#### Request Document

```typescript
interface Request {
  id: string;                    // Firestore auto-generated ID
  dance_name: string;            // Required
  song_title: string;            // Required
  artist: string;                // Optional, can be empty string
  upvote_count: number;          // Default: 0
  upvoted_by: string[];          // Array of session IDs
  status: 'pending' | 'added_to_playlist' | 'played';
  timestamp: Timestamp;          // Request submission time
  created_at: Timestamp;         // Document creation time
  completed_at: Timestamp | null; // When marked as played
  created_by: string;            // Session ID of requester
}
```

#### Dance Document (Phase 2)

```typescript
interface Dance {
  id: string;
  dance_name: string;
  song_title: string;
  artist: string;
  last_requested: Timestamp | null;
  created_at: Timestamp;
  request_count: number;         // How many times requested
}
```

#### Session Document

```typescript
interface Session {
  id: string;                    // Custom generated UUID
  created_at: Timestamp;
  last_active: Timestamp;
  user_type: 'dancer' | 'dj';
  upvoted_requests: string[];    // Array of request IDs
}
```

### Indexes Required

```
Collection: requests
├── Composite Index 1: status (asc) + upvote_count (desc)
├── Composite Index 2: status (asc) + timestamp (desc)
└── Composite Index 3: status (asc) + dance_name (asc)
```

Firestore will automatically suggest these when queries are first run.

---

## Security Rules Design

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isDJ() {
      return isAuthenticated() && 
             request.auth.token.email != null;
    }
    
    function isAnonymous() {
      return isAuthenticated() && 
             request.auth.token.email == null;
    }
    
    function hasValidSession() {
      return request.auth != null && 
             request.auth.uid != null;
    }
    
    // Requests collection
    match /requests/{requestId} {
      // Anyone can read pending/added requests
      allow read: if resource.data.status in ['pending', 'added_to_playlist'];
      
      // Authenticated users can create requests
      allow create: if hasValidSession() && 
                      request.resource.data.dance_name is string &&
                      request.resource.data.song_title is string &&
                      request.resource.data.upvote_count == 0 &&
                      request.resource.data.created_by == request.auth.uid;
      
      // Only DJ can update status
      allow update: if isDJ() && 
                      request.resource.data.diff(resource.data)
                        .affectedKeys()
                        .hasOnly(['status', 'completed_at']);
      
      // Only DJ can delete
      allow delete: if isDJ();
      
      // Special rule for upvoting
      allow update: if hasValidSession() && 
                      request.resource.data.diff(resource.data)
                        .affectedKeys()
                        .hasOnly(['upvote_count', 'upvoted_by']) &&
                      request.resource.data.upvote_count == resource.data.upvote_count + 1 &&
                      request.auth.uid in request.resource.data.upvoted_by &&
                      !(request.auth.uid in resource.data.upvoted_by);
    }
    
    // Dances collection (Phase 2)
    match /dances/{danceId} {
      // Anyone can read
      allow read: if true;
      
      // Only DJ can write
      allow write: if isDJ();
    }
    
    // Sessions collection
    match /sessions/{sessionId} {
      // Users can only read/write their own session
      allow read, write: if hasValidSession() && 
                           sessionId == request.auth.uid;
    }
  }
}
```

### Authentication Strategy

**Dancers (Anonymous Auth):**
```javascript
import { signInAnonymously } from 'firebase/auth';

// On app load, sign in anonymously
const signIn = async () => {
  const result = await signInAnonymously(auth);
  const sessionId = result.user.uid;
  // Store in localStorage for reference
  localStorage.setItem('sessionId', sessionId);
  return sessionId;
};
```

**DJ (Email/Password):**
```javascript
import { signInWithEmailAndPassword } from 'firebase/auth';

// DJ login form
const djLogin = async (email, password) => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
};
```

---

## Service Layer Architecture

### File Structure

```
src/
├── firebase/
│   ├── config.js              # Existing - Firebase initialization
│   ├── auth.js                # NEW - Authentication helpers
│   ├── requests.js            # NEW - Request operations
│   ├── dances.js              # NEW - Dance library operations (Phase 2)
│   └── sessions.js            # NEW - Session management
├── composables/
│   ├── useAuth.js             # NEW - Auth composable
│   ├── useRequests.js         # NEW - Requests composable
│   ├── useUpvotes.js          # NEW - Upvote logic composable
│   └── useSessions.js         # NEW - Session tracking composable
└── components/
    └── (existing components)
```

### Service Layer Functions

#### src/firebase/auth.js

```javascript
import { auth } from './config';
import { 
  signInAnonymously, 
  signInWithEmailAndPassword,
  signOut 
} from 'firebase/auth';

/**
 * Sign in anonymously as a dancer
 */
export const signInAsDancer = async () => {
  try {
    const result = await signInAnonymously(auth);
    const sessionId = result.user.uid;
    localStorage.setItem('sessionId', sessionId);
    return sessionId;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

/**
 * Sign in as DJ with email/password
 */
export const signInAsDJ = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error('Error signing in as DJ:', error);
    throw error;
  }
};

/**
 * Sign out current user
 */
export const signOutUser = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem('sessionId');
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

/**
 * Get current user
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Check if user is DJ (has email)
 */
export const isDJ = () => {
  const user = auth.currentUser;
  return user && user.email !== null;
};
```

#### src/firebase/requests.js

```javascript
import { db } from './config';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  arrayUnion,
  increment
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
    where('status', 'in', ['pending', 'added_to_playlist']),
    orderBy('upvote_count', 'desc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const requests = [];
    snapshot.forEach((doc) => {
      requests.push({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate(),
        created_at: doc.data().created_at?.toDate(),
        completed_at: doc.data().completed_at?.toDate()
      });
    });
    callback(requests);
  });
};

/**
 * Create a new request
 */
export const createRequest = async (requestData, sessionId) => {
  try {
    const docRef = await addDoc(requestsCollection, {
      dance_name: requestData.dance_name,
      song_title: requestData.song_title || requestData.dance_name,
      artist: requestData.artist || '',
      upvote_count: 0,
      upvoted_by: [],
      status: 'pending',
      timestamp: serverTimestamp(),
      created_at: serverTimestamp(),
      completed_at: null,
      created_by: sessionId
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating request:', error);
    throw error;
  }
};

/**
 * Upvote a request
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
 * Update request status (DJ only)
 */
export const updateRequestStatus = async (requestId, status) => {
  try {
    const requestRef = doc(db, 'requests', requestId);
    const updateData = { status };
    
    if (status === 'played') {
      updateData.completed_at = serverTimestamp();
    }
    
    await updateDoc(requestRef, updateData);
  } catch (error) {
    console.error('Error updating request status:', error);
    throw error;
  }
};

/**
 * Delete a request (DJ only)
 */
export const deleteRequest = async (requestId) => {
  try {
    await deleteDoc(doc(db, 'requests', requestId));
  } catch (error) {
    console.error('Error deleting request:', error);
    throw error;
  }
};

/**
 * Clear all completed requests (DJ only)
 */
export const clearCompletedRequests = async () => {
  const q = query(requestsCollection, where('status', '==', 'played'));
  const snapshot = await getDocs(q);
  
  const deletePromises = [];
  snapshot.forEach((doc) => {
    deletePromises.push(deleteDoc(doc.ref));
  });
  
  await Promise.all(deletePromises);
};
```

#### src/composables/useRequests.js

```javascript
import { ref, onMounted, onUnmounted } from 'vue';
import { subscribeToRequests, createRequest, upvoteRequest } from '../firebase/requests';
import { getCurrentUser } from '../firebase/auth';

export function useRequests() {
  const requests = ref([]);
  const loading = ref(true);
  const error = ref(null);
  let unsubscribe = null;

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
      const user = getCurrentUser();
      if (!user) throw new Error('Not authenticated');
      
      const requestId = await createRequest(requestData, user.uid);
      return requestId;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  const handleUpvote = async (requestId) => {
    try {
      const user = getCurrentUser();
      if (!user) throw new Error('Not authenticated');
      
      // Check if already upvoted (optimistic check)
      const request = requests.value.find(r => r.id === requestId);
      if (request && request.upvoted_by.includes(user.uid)) {
        return; // Already upvoted
      }
      
      await upvoteRequest(requestId, user.uid);
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  return {
    requests,
    loading,
    error,
    addRequest,
    handleUpvote
  };
}
```

#### src/composables/useAuth.js

```javascript
import { ref, onMounted } from 'vue';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { signInAsDancer, signInAsDJ, signOutUser, isDJ } from '../firebase/auth';

export function useAuth() {
  const user = ref(null);
  const loading = ref(true);
  const isAuthenticated = ref(false);
  const isAdmin = ref(false);

  onMounted(() => {
    // Listen for auth state changes
    onAuthStateChanged(auth, (currentUser) => {
      user.value = currentUser;
      isAuthenticated.value = !!currentUser;
      isAdmin.value = isDJ();
      loading.value = false;
    });
  });

  const loginAsDancer = async () => {
    try {
      await signInAsDancer();
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const loginAsDJ = async (email, password) => {
    try {
      await signInAsDJ(email, password);
    } catch (error) {
      console.error('DJ login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  return {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    loginAsDancer,
    loginAsDJ,
    logout
  };
}
```

---

## Implementation Phases

### Phase 1: Authentication & Sessions (Week 1)

**Goal:** Get users authenticated and sessions tracked

**Tasks:**
1. Create `src/firebase/auth.js` service
2. Create `src/composables/useAuth.js` composable
3. Update `App.vue` to initialize auth on mount
4. Auto sign-in anonymously when app loads
5. Store session ID in localStorage
6. Test authentication flow

**Files to Create/Modify:**
- `src/firebase/auth.js` (new)
- `src/composables/useAuth.js` (new)
- `src/App.vue` (modify)
- `src/main.js` (modify if needed)

**Testing:**
- Verify anonymous auth works
- Check session ID in localStorage
- Verify auth state persists on refresh

---

### Phase 2: Request CRUD Operations (Week 1-2)

**Goal:** Replace mock data with Firestore

**Tasks:**
1. Create `src/firebase/requests.js` service
2. Create `src/composables/useRequests.js` composable
3. Update `RequestQueue.vue` to use composable
4. Replace mock data with real-time listener
5. Update `handleNewRequest` to use Firebase
6. Update `handleUpvote` to use Firebase
7. Test real-time updates across multiple browsers

**Files to Create/Modify:**
- `src/firebase/requests.js` (new)
- `src/composables/useRequests.js` (new)
- `src/components/RequestQueue.vue` (modify)
- `src/components/NewRequestModal.vue` (modify if needed)

**Testing:**
- Create request from form
- Verify it appears in Firestore console
- Test upvoting
- Open two browsers, verify real-time sync
- Test sort functionality with live data

---

### Phase 3: Upvote Persistence (Week 2)

**Goal:** Prevent duplicate upvotes, persist across refresh

**Tasks:**
1. Store `upvoted_by` array in Firestore
2. Check if session ID is in array before allowing upvote
3. Update UI to show upvoted state from Firestore
4. Handle edge cases (user refreshes page)
5. Test duplicate prevention

**Files to Modify:**
- `src/firebase/requests.js` (update upvote logic)
- `src/composables/useRequests.js` (add upvote checking)
- `src/components/RequestQueue.vue` (use persisted upvote state)
- `src/components/RequestCard.vue` (update isUpvoted logic)

**Testing:**
- Upvote a request
- Refresh page
- Verify upvote button is still disabled
- Try upvoting again (should fail)

---

### Phase 4: Security Rules (Week 2)

**Goal:** Protect data with Firestore security rules

**Tasks:**
1. Write security rules in Firebase console or `firestore.rules` file
2. Test rules with Firebase emulator
3. Deploy rules to production
4. Verify unauthorized actions are blocked

**Files to Create:**
- `firestore.rules` (new)
- Update `firebase.json` to reference rules

**Testing:**
- Try creating request without auth (should fail)
- Try upvoting twice (should fail)
- Try updating status without DJ auth (should fail)

---

### Phase 5: Error Handling & Loading States (Week 3)

**Goal:** Handle errors gracefully, show loading states

**Tasks:**
1. Add loading spinners while data fetches
2. Show error messages for failed operations
3. Add retry logic for network errors
4. Handle offline state
5. Add success notifications

**Files to Modify:**
- All composables (add error handling)
- `src/components/RequestQueue.vue` (add loading UI)
- `src/components/NewRequestModal.vue` (add error messages)

**Testing:**
- Disconnect network, verify offline message
- Force errors, verify error messages
- Test retry functionality

---

### Phase 6: DJ Admin Features (Week 3-4)

**Goal:** Add DJ-specific functionality

**Tasks:**
1. Create DJ login page/component
2. Add "Mark as Added to Playlist" button
3. Add "Mark as Played" button
4. Add "Clear Completed" functionality
5. Protect admin actions with auth checks

**Files to Create/Modify:**
- `src/components/DJLogin.vue` (new)
- `src/components/AdminView.vue` (new)
- `src/firebase/requests.js` (add admin functions)
- Router setup if needed

**Testing:**
- Login as DJ
- Mark requests with different statuses
- Verify status changes sync across clients
- Test unauthorized access prevention

---

## Migration Strategy

### Step-by-Step Migration

**1. Parallel Implementation (Safe Approach)**
- Keep mock data initially
- Add Firebase alongside
- Toggle between mock and Firebase with feature flag
- Test thoroughly before removing mock data

```javascript
// Feature flag in RequestQueue.vue
const USE_FIREBASE = import.meta.env.VITE_USE_FIREBASE === 'true';

if (USE_FIREBASE) {
  // Use Firebase composable
  const { requests, addRequest, handleUpvote } = useRequests();
} else {
  // Use existing mock data
  const requests = ref([...mockData]);
}
```

**2. Data Seeding**
- Create script to seed Firestore with current mock data
- Useful for testing and development

```javascript
// src/firebase/seed.js
import { db } from './config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const mockRequests = [ /* existing mock data */ ];

export const seedDatabase = async () => {
  const requestsRef = collection(db, 'requests');
  
  for (const request of mockRequests) {
    await addDoc(requestsRef, {
      ...request,
      timestamp: serverTimestamp(),
      created_at: serverTimestamp(),
      upvoted_by: [],
      created_by: 'seed_script'
    });
  }
};
```

**3. Gradual Rollout**
- Phase 1: Implement read-only (display from Firestore)
- Phase 2: Add write operations (create requests)
- Phase 3: Add upvoting
- Phase 4: Add admin features

---

## Testing Strategy

### Unit Tests

**Test Firebase Functions:**
```javascript
// tests/unit/firebase-requests.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { createRequest, upvoteRequest } from '@/firebase/requests';

describe('Firebase Requests', () => {
  it('should create a request', async () => {
    const requestData = {
      dance_name: 'Test Dance',
      song_title: 'Test Song',
      artist: 'Test Artist'
    };
    
    const requestId = await createRequest(requestData, 'test-session-id');
    expect(requestId).toBeTruthy();
  });
  
  it('should upvote a request', async () => {
    // Test upvote logic
  });
});
```

### Integration Tests

**Test with Firebase Emulator:**
```powershell
# Install Firebase emulator
firebase init emulators

# Start emulator
firebase emulators:start

# Run tests against emulator
FIRESTORE_EMULATOR_HOST=localhost:8080 npm run test
```

### End-to-End Tests

**Update Playwright Tests:**
- Add tests for authentication flow
- Test request creation with Firebase
- Test upvoting with persistence
- Test multi-client real-time sync

---

## Rollback Plan

### If Issues Arise

**Feature Flag Rollback:**
```javascript
// .env.local
VITE_USE_FIREBASE=false  // Switch back to mock data
```

**Database Rollback:**
- Keep backup of Firestore data
- Export data before major changes
```bash
firebase firestore:export backup-$(date +%Y%m%d)
```

**Code Rollback:**
- Git branch strategy: `main` stays stable
- Develop in `feature/firebase-backend` branch
- Only merge when fully tested

---

## Environment Variables

### Required Configuration

```bash
# .env.local (not committed to git)
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id

# Feature flags
VITE_USE_FIREBASE=true
VITE_USE_EMULATOR=false  # For local development
```

---

## Performance Considerations

### Optimization Strategies

1. **Pagination** - Load requests in batches if >50
2. **Debouncing** - Debounce upvote clicks
3. **Optimistic Updates** - Update UI before Firebase confirms
4. **Caching** - Cache dance list locally
5. **Indexes** - Add composite indexes for common queries

### Monitoring

- Use Firebase Performance Monitoring
- Track read/write counts
- Monitor authentication failures
- Track real-time connection status

---

## Cost Estimation

### Firebase Free Tier Limits

- **Firestore Reads**: 50,000/day
- **Firestore Writes**: 20,000/day
- **Firestore Deletes**: 20,000/day
- **Storage**: 1 GB
- **Data Transfer**: 10 GB/month

### Expected Usage (Weekly Event)

- **Active Users**: 40 dancers/event
- **Requests**: ~50 requests/event
- **Upvotes**: ~200 upvotes/event
- **Reads**: ~2,000 reads/event (40 users × 50 requests)
- **Writes**: ~250 writes/event (50 requests + 200 upvotes)

**Conclusion:** Well within free tier limits!

---

## Next Steps

1. ✅ Create this implementation plan
2. Review and approve plan
3. Create Firebase service files
4. Implement authentication
5. Replace mock data with Firestore
6. Add security rules
7. Test thoroughly
8. Deploy to production

---

**End of Plan**
