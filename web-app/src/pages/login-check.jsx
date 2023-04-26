import { ContainerMobile } from '@/components/ContainerMobile'
import { Heading } from '@/components/Heading'
import { Paragraph } from '@/components/Paragraph'
import { Button } from '@/components/Button'
import { useState, useEffect } from 'react'
import { functions } from '@/firebase.js'
import { httpsCallable } from 'firebase/functions'
import { auth } from '@/firebase.js'
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth'
import { useRouter } from 'next/router'

export default function LoginCheck() {
  const router = useRouter()
  let [status, setStatus] = useState(false)
  let [showError, setShowError] = useState(false)

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
          auth.currentUser
            .getIdTokenResult()
            .then((idTokenResult) => {
              // store details in local storage
              // You can access the new user via result.user
              const cid = result.user.uid
              window.localStorage.setItem('cid', cid)
              const func = httpsCallable(functions, 'user-getInfo')
              func({ cid: cid }).then((r) => {
                window.localStorage.setItem('displayName', r.data.name)
                const type = r.data.type
                if (
                  type === 'admin' ||
                  type === 'partner' ||
                  type === 'participant'
                ) {
                  window.localStorage.setItem('type', type)
                  router.push('/' + type)
                } else {
                  throw ''
                }
              })
            })
            .catch((error) => {
              setShowError(true)
              console.log(error)
            })

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
  }, [router])

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
          {showError ? (
            <Button href="/login" className="mt-5 w-full">
              Back to Login
            </Button>
          ) : null}
        </div>
      </ContainerMobile>
    </>
  )
}
