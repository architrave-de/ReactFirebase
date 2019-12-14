import firebase from 'firebase/app'
import { firestone } from 'firebase/firestore'
import { firebaseConfig } from './configs'

export const firebaseUiConfig = ({ redirectUrl }) => {
  return {
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccess: function(currentUser, credential, redirectUrl) {
        // return false to stop redirecting
        return false
      }
    }
  }
}

firebase.initializeApp(firebaseConfig)

export const DB = firebase.firestore()
