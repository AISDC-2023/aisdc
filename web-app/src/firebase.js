import { initializeApp } from 'firebase/app'
import { getFunctions } from 'firebase/functions'

const app = initializeApp({
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
})

export const functions = getFunctions(app, 'asia-southeast1')
