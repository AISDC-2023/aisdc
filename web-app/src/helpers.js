import { getAuth, sendSignInLinkToEmail, onAuthStateChanged  } from 'firebase/auth'

export function sendEmail(params, email) {
  const auth = getAuth()
  const actionCodeSettings = {
    url: `${process.env.NEXT_PUBLIC_FIREBASE_APP_URL}/login-check?${params}`,
    handleCodeInApp: true,
  }
  return sendSignInLinkToEmail(auth, email, actionCodeSettings)
}

export async function getUid() {
  return new Promise((resolve, reject) => {
    const auth = getAuth()
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        resolve(uid);
      } else {
        // User is signed out
        // ...
        reject(null)
      }
    });
  })
}