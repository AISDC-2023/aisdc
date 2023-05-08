import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { functions } from '@/firebase.js'
import { getAuth, onAuthStateChanged  } from 'firebase/auth'

import { httpsCallable } from 'firebase/functions'
import { sendEmail, getUid } from '@/helpers'
import { ContainerMobile } from '@/components/ContainerMobile'
import { Paragraph } from '@/components/Paragraph'
import { Heading } from '@/components/Heading'

export default function Login() {
  const [unregistered, setShowUnregistered] = useState(false)
  const [verifying, setVerifying] = useState(true)
  const [verified, setVerified] = useState(false)
  const [cidInvalid, setCidInvalid] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()
  const userVerify = httpsCallable(functions, 'user-verify')

  function redirect(cid) {
    userVerify({ cid: cid }).then((result) => {
      const type = result.data?.type
      setIsLoggedIn(true)
      router.push('/' + type)
    })
  }

  function checks(cid) {
    userVerify({ cid: cid })
      .then((result) => {
        const type = result.data?.type
        const email = result.data?.email
        let params = ''
        if (type === 'admin' || type === 'partner' || type === 'participant') {
          params = 'cid=' + cid
        } else {
          setVerifying(false)
          setShowUnregistered(true)
          router.push('/register?cid=' + cid)
        }

        setVerifying(false)
        setVerified(true)
        sendEmail(params, email)
          .then(() => {
            // The link was successfully sent. Inform the user.
            window.localStorage.setItem('emailForSignIn', email)
            router.push('/email-sent')
          })
          .catch((error) => {
            console.log(error)

            console.error('Error occured while sending email')
          })
        // end
      })
      .catch((error) => {
        if (error.code === 'functions/not-found') {
          // User is not registered, redirect to register page
          router.push('/register?cid=' + cid)
        } else if (error.code === 'functions/invalid-argument') {
          setVerifying(false)
          setVerified(false)
          setCidInvalid(true)
        } else {
          console.error(error.code)
          setVerifying(false)
          setVerified(false)
        }
      })
  }

  useEffect(() => {
    // check if already logged in
      getUid().then((uid) => {
      if (uid) {
        redirect(uid)
      } else {
        // User not signed in check router
          const cid = router.query.cid
          if (cid === undefined) {
            // cid empty
            setVerifying(false)
            setVerified(false)
            setCidInvalid(true)
          } else {
            checks(uid)
          }
      }
    })

  }, [router])

  return (
    <>
      <ContainerMobile>
        <Heading headerType="h2" className="mt-6">
          {!isLoggedIn
            ? verifying
              ? `VERIFYING`
              : verified
              ? `SENDING MAIL`
              : unregistered
              ? `UNREGISTERED`
              : cidInvalid
              ? `INVALID`
              : `ERROR`
            : `LOGGED IN`}
        </Heading>
        <div className="mt-8">
          <Paragraph className="font-semibold">
            {!isLoggedIn
              ? verifying
                ? `Talking to server...`
                : verified
                ? `Server verified`
                : unregistered
                ? `Redirecting you to register`
                : `PLEASE LOGIN WITH QR CODE`
              : `Redirecting you to dashboard`}
          </Paragraph>
        </div>
      </ContainerMobile>
    </>
  )
}