import { db } from './config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const requestsCollection = collection(db, 'requests');

const seedData = [
  {
    dance_name: 'Two Step',
    song_title: 'Better Bad Idea',
    artist: 'Sunny Sweeney',
    upvote_count: 0,
    upvoted_by: [],
    status: 'pending',
    timestamp: serverTimestamp()
  },
  {
    dance_name: 'Two Step',
    song_title: 'Simple',
    artist: 'Florida Georgia Line',
    upvote_count: 0,
    upvoted_by: [],
    status: 'pending',
    timestamp: serverTimestamp()
  },
  {
    dance_name: 'Two Step',
    song_title: 'Speed Of Love',
    artist: 'Florida Georgia Line',
    upvote_count: 0,
    upvoted_by: [],
    status: 'pending',
    timestamp: serverTimestamp()
  },
  {
    dance_name: 'Two Step',
    song_title: 'One I Want',
    artist: 'Flatland Cavalry',
    upvote_count: 0,
    upvoted_by: [],
    status: 'pending',
    timestamp: serverTimestamp()
  },
  {
    dance_name: 'Two Step',
    song_title: 'Past The Point Of Rescue',
    artist: 'Hal Ketchum',
    upvote_count: 0,
    upvoted_by: [],
    status: 'pending',
    timestamp: serverTimestamp()
  }
];

export const seedRequests = async () => {
  try {
    console.log('Starting to seed requests...');
    
    const promises = seedData.map(request => addDoc(requestsCollection, request));
    const results = await Promise.all(promises);
    
    console.log(`Successfully seeded ${results.length} requests`);
    results.forEach((docRef, index) => {
      console.log(`  - Added: ${seedData[index].song_title} by ${seedData[index].artist} (ID: ${docRef.id})`);
    });
    
    return results;
  } catch (error) {
    console.error('Error seeding requests:', error);
    throw error;
  }
};
