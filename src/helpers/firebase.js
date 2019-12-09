import firebase from 'firebase/app'
import { firestone } from 'firebase/firestore'
import { firebaseConfig } from './configs'

firebase.initializeApp(firebaseConfig)

export const DB = firebase.firestore()
