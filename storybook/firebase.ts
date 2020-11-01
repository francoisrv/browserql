import firebase from 'firebase/app'
import 'firebase/firestore'

export default function makeFirebaseApp(config: { [a: string]: string }) {
  const firebaseConfig = {
    apiKey: config.API_KEY,
    authDomain: config.AUTHDOMAIN,
    databaseURL: config.BASEURL,
    projectId: config.PROJECT_ID,
    storageBucket: config.STORAGEBUCKET,
    messagingSenderId: config.MESSAGING_SENDER_ID,
    appId: config.APP_ID,
    measurementId: config.MEASUREMENT_ID,
  }
  !firebase.apps.length
    ? firebase.initializeApp(firebaseConfig)
    : firebase.app()
  return firebase.firestore()
}
