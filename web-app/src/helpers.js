import { getAuth, sendSignInLinkToEmail } from 'firebase/auth'

export function sendEmail(cid, email) {
  const auth = getAuth()
  const actionCodeSettings = {
    url: `${process.env.NEXT_PUBLIC_FIREBASE_APP_URL}/login-check?cid=${cid}`,
    handleCodeInApp: true
  }
  return sendSignInLinkToEmail(auth, email, actionCodeSettings);
}
