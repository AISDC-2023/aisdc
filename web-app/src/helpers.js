import { useRouter } from 'next/router'
import { getAuth, sendSignInLinkToEmail } from 'firebase/auth'

export function sendEmail(path, email) {
  const router = useRouter()
  const actionCodeSettings = {
    url: process.env.NEXT_PUBLIC_FIREBASE_APP_URL + path,
  }
  const auth = getAuth()
  sendSignInLinkToEmail(auth, email, actionCodeSettings).then(() => {
    // The link was successfully sent. Inform the user.
    window.localStorage.setItem('emailForSignIn', email)
    router.replace('/email-sent')
  })
}
