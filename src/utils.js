import { writable, get } from 'svelte/store';
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db, serverTime } from './db.js'
//############################
// GLOBAL EXPERIMENT VARIABLES
//############################
// Add any global variables you want to use elsewhere in the app
// Then use them in another file by importing:
// import { globalVars } from '../utils.js';
// console.log(globalVars.time)
export const globalVars = {
  time: 5,
  userCollection: 'participants' // change this if you didn't use 'participants'
};

// Initialize an empty reactive global variable (Svelte store) for storing a single 
// user's data that will be accessible throughout the app
export const userStore = writable({
  userId: null,
  currentState: 'consent',
  currentTrial: 1,
  consent_start: null,
});

// Initialize another empty reactive variable that holds onto the userId they user to
// login so we an also use it for creating a data record and subscribing to it
export const userId = writable('');

// Global sveltestore that tracks the firestore unsubsribe function
export const dataUnsubscribe = writable(null);

//############################

//############################
// GLOBAL EXPERIMENT FUNCTIONS
//############################
// Add any functions here that you want to reuse throughout the app

// Function to create a new user record in the database
export const initUser = async () => {
  const userName = get(userId)
  try {
    const docRef = doc(db, globalVars.userCollection, userName);
    // Add any additional fields here that you want
    await setDoc(docRef, {
      userId: userName,
      currentState: 'consent',
      currentTrial: 1,
      consent_start: serverTime,
    });

    console.log(`Successfully initialized user with document ID: ${docRef.id}`);
  } catch (error) {
    console.error(`Error initializing new document with ID ${userId}: `, error);
  }
}

// Function to synchronize the userStore with realtime firestore data. If passed an
// autoCreateFunc it will run this function if a document does not exist under the name
// $userId (sveltestore). In App.svelte we pass it initUser which is defined above.
// Arguments: 
//     collection (string)
//     autoCreateFunc (function; optional)
export const setupUserSubscription = async (collection, autoCreateFunc = null) => {
  const userName = get(userId)
  try {
    const unsubscribe = onSnapshot(doc(db, collection, userName), async (doc) => {
      if (doc.exists()) {
        //@ts-ignore
        userStore.set(doc.data());
      } else {
        console.log(`No document found for: ${userName}`)
        if (autoCreateFunc !== null) {
          console.log("Calling auto-create function");
          await autoCreateFunc()
        }
      }
    })
    console.log("Data subscription on!")
    dataUnsubscribe.set(unsubscribe)
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Function to update an existing user record in the database
// Arguments:
//    data: (object) existing or new key, values to update
export const updateUser = async (updateData) => {
  const data = get(userStore)
  const userId = data.userId
  for (const [key, val] of Object.entries(updateData)) {
    data[key] = val
  }
  try {
    const docRef = doc(db, globalVars.userCollection, userId);
    await setDoc(docRef, data);

    console.log(`user doc successfully updated: ${docRef.id}`);
  } catch (error) {
    console.error(`Error updating user document: ${userId}:`, error);
  }
};