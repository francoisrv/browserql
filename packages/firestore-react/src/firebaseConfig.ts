import firebase from 'firebase'
import 'firebase/firestore'

// Firebase Config
export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  // authDomain: process.env.FIREBASE_AUTHDOMAIN,
  databaseURL: process.env.FIREBASE_BASEURL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)
