import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { functions } from '@/firebase.js'
import { httpsCallable } from 'firebase/functions'
import { sendEmail } from '@/helpers'
import { ContainerMobile } from '@/components/ContainerMobile'
import { Paragraph } from '@/components/Paragraph'
import { Heading } from '@/components/Heading'

export default function Login() {
  const [unregistered, setShowUnregistered] = useState(false)
  const [verifying, setVerifying] = useState(true)
  const [verified, setVerified] = useState(false)
  const [cidInvalid, setCidInvalid] = useState(false)
  const router = useRouter()

  function checks(cid) {
    if (cid !== null) {
      const userVerify = httpsCallable(functions, 'user-verify')
      userVerify({ cid: cid })
        .then((result) => {
          const type = result.data?.type
          const email = result.data?.email
          let params = ''
          if (
            type === 'admin' ||
            type === 'partner' ||
            type === 'participant'
          ) {
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
            console.error(error.code);
            setVerifying(false)
            setVerified(false)
          }
        })
    }
  }

  useEffect(() => {
    const cid = router.query.cid
    if (cid === undefined){
      setCidInvalid(true);
    }
    checks(cid)
  }, [router])

  return (
    <>
      <ContainerMobile>
        <Heading headerType="h2" className="mt-6">
          {verifying
            ? `VERIFYING`
            : verified
            ? `SENDING MAIL`
            : unregistered
            ? `UNREGISTERED`
            : cidInvalid
            ? `CID IS INVALID. PLEASE LOGIN WITH PROPER URL`
            : `ERROR`}
        </Heading>
        <div className="mt-8">
          <Paragraph className="font-semibold">
            {verifying
              ? `Talking to server...`
              : verified
              ? `Server verified`
              : unregistered
              ? `Redirecting you to register`
              : `Please try again ...`}
          </Paragraph>
        </div>
      </ContainerMobile>
    </>
  )
}

Login.getInitialProps = async (ctx) => {
  console.log(ctx)
  const cid = ctx.query.cid
  return { cid }
}

// Login.getInitialProps({ context }) {

//   // console.log(context)
//   // context value contains the query params
//   // const cid = context.query.cid;
//   useEffect(() => {

//   }, [context])
// const cid = ""
//   return {
//     props: [cid]
//   }
//   }
