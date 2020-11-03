import React from 'react'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import { IfFirebaseAuthed, IfFirebaseUnAuthed } from '@react-firebase/auth'

export default function FirebaseLoginSB() {
  const handleSubmit = () => {
    const googleAuthProvider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().signInWithPopup(googleAuthProvider)
  }

  return (
    <>
      <IfFirebaseAuthed>{() => <div>Logged in</div>}</IfFirebaseAuthed>
      <IfFirebaseUnAuthed>
        {() => <button onClick={handleSubmit}>Log in with google</button>}
      </IfFirebaseUnAuthed>
    </>
  )
}
