import { initializeApp } from 'firebase/app'
import { getFunctions } from 'firebase/functions'
import { getAuth } from 'firebase/auth'

const app = initializeApp({
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
})

const functions = getFunctions(app, 'asia-southeast1')
const auth = getAuth(app)

export { functions, auth }
