import { 
  signInAnonymously as firebaseSignInAnonymously,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from './config';

/**
 * Sign in anonymously for dancers
 * @returns {Promise<UserCredential>}
 */
export const signInAnonymously = async () => {
  try {
    const userCredential = await firebaseSignInAnonymously(auth);
    console.log('Signed in anonymously:', userCredential.user.uid);
    return userCredential;
  } catch (error) {
    console.error('Error signing in anonymously:', error);
    throw error;
  }
};

/**
 * Sign in with email and password for DJ
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<UserCredential>}
 */
export const signInWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await firebaseSignInWithEmailAndPassword(auth, email, password);
    console.log('Signed in as DJ:', userCredential.user.email);
    return userCredential;
  } catch (error) {
    console.error('Error signing in with email/password:', error);
    throw error;
  }
};

/**
 * Sign out current user
 * @returns {Promise<void>}
 */
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    console.log('Signed out successfully');
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

/**
 * Get current authenticated user
 * @returns {User|null}
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Check if current user is DJ (authenticated with email/password)
 * @returns {boolean}
 */
export const isDJ = () => {
  const user = auth.currentUser;
  return user && !user.isAnonymous;
};

/**
 * Subscribe to auth state changes
 * @param {Function} callback - Called with user object when auth state changes
 * @returns {Function} Unsubscribe function
 */
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};
