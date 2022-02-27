
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth, onAuthStateChanged, } from 'firebase/auth';
import { getFirestore, doc, onSnapshot, serverTimestamp } from 'firebase/firestore'
import { writable } from 'svelte/store';

//###############################################
// INITIALIZE AND SETUP FIREBASE FOR DATA STORAGE
//###############################################
// NOTE: This app uses the module version of the firebase JS library which uses
// different syntax since version 9.x.x

// Copy and paste your firebase config here:
const firebaseConfig = {
  apiKey: "AIzaSyD9udIO5ap006xab7tb2bZ6s5C7Kc4m7YM",
  authDomain: "max-thesis.firebaseapp.com",
  projectId: "max-thesis",
  storageBucket: "max-thesis.appspot.com",
  messagingSenderId: "658200948450",
  appId: "1:658200948450:web:15a5eff940daf56b3378bb"
};

// Check firebase config isn't empty
if (Object.keys(firebaseConfig).length === 0) {
  throw `Oops you didn't paste in your firebase config. Make sure you edit db.js and paste it into line 14!`
}

initializeApp(firebaseConfig);

// Sveltestore that tracks if user is logged in
export const loggedIn = writable(false);

// Export database variables for use elsewhere in the app
// Exporting them from this file after initializing the database connection above
// makes it easy to read/write to the database from any file in the app
// Use them by importing in another file:
// import { db } from 'utils.js'
// db.collection(...)
export const db = getFirestore();
export const storage = getStorage();
export const serverTime = serverTimestamp();
export const auth = getAuth();

// Keep $loggedIn sveltestore in-sync with firestore auth state
onAuthStateChanged(auth, (user) => {
  loggedIn.set(user !== null)
})
