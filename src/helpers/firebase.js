import firebase from 'firebase/app'
import 'firebase/firestore'
import { firebaseConfig } from './configs'

firebase.initializeApp(firebaseConfig)

export const DB = firebase.firestore()
