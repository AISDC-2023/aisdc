import { ContainerMobile } from '@/components/ContainerMobile'
import { Heading } from '@/components/Heading'
import { Paragraph } from '@/components/Paragraph'
import { useState, useEffect } from 'react'
import { functions, auth } from '@/firebase.js'
import { httpsCallable } from 'firebase/functions'
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth'
import { useRouter } from 'next/router'

export default function LoginCheck() {
  const router = useRouter()
  const [status, setStatus] = useState(false)
  const [showError, setShowError] = useState(false)

  function getUserInfo(cid) {
    const userVerify = httpsCallable(functions, 'user-verify')
    userVerify({ cid: cid }).then((r) => {
      const type = r.data.type
      if (type === 'admin' || type === 'participant') {
        router.push('/' + type)
      } else {
        throw ''
      }
    })
  }

  useEffect(() => {
    // Confirm the link is a sign-in with email link.
    if (isSignInWithEmailLink(auth, window.location.href)) {
      // Additional state parameters can also be passed via URL.
      // This can be used to continue the user's intended action before triggering
      // the sign-in operation.
      // Get the email if available. This should be available if the user completes
      // the flow on the same device where they started it.
      let email = window.localStorage.getItem('emailForSignIn')
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt('Please provide your email for confirmation')
      }
      // The client SDK will parse the code from the link for you.

      signInWithEmailLink(auth, email, window.location.href)
        .then((result) => {
          setStatus(true)
          const cid = result.user.uid
          getUserInfo(cid)
          // Clear email from storage.
          window.localStorage.removeItem('emailForSignIn')
        })
        .catch((error) => {
          console.log(error)
          setShowError(true)
          // Some error occurred, you can inspect the code: error.code
          // Common errors could be invalid email and invalid or expired OTPs.
        })
    }
  }, [])

  return (
    <>
      <ContainerMobile>
        <Heading headerType="h2" className="mt-6">
          {status
            ? `YOU'RE IN!`
            : showError
            ? `ERROR`
            : `CHECKING WITH SATELLITE...`}
        </Heading>
        <div className="mt-8">
          <Paragraph className="font-semibold">
            {status
              ? `Redirecting you now....`
              : showError
              ? `Please try to login again`
              : null}
          </Paragraph>
        </div>
      </ContainerMobile>
    </>
  )
}
