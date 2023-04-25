import React, { useRef } from 'react'
import { useRouter } from 'next/router'
import { functions } from '@/firebase.js'
import { httpsCallable } from 'firebase/functions'
import { sendEmail } from '@/helpers'
import { ContainerMobile } from '@/components/ContainerMobile'
import { Button } from '@/components/Button'
import { Heading } from '@/components/Heading'
import { QrReader } from 'react-qr-reader'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { getAuth, sendSignInLinkToEmail } from 'firebase/auth'

const QRScanner = (props) => {
  const router = useRouter()
  const scanCidRef = useRef(null);
  return (
    <>
      <QrReader
        constraints={{ facingMode: 'environment' }}
        scanDelay={1000}
        onResult={async (result, error) => {
          if (!!result) {
            const cid = result?.text;
            // Check if cid is 10 digit alphanumeric
            if (cid && !cid.match(/^[a-zA-Z0-9]{10}$/)) {
              // TODO: Find more elegant way to display this on the page
              alert('Invalid QR Code')
              return
            }
            // if cid is new then process
            if (scanCidRef.current !== cid){
              // valid cid so set
              scanCidRef.current = cid;
              const userVerify = httpsCallable(functions, 'user-verify')
              userVerify({ cid: cid })
                .then((result) => {
                  //TODO : update code for path, test if FB function work first
                  const type = result.data?.type;
                  const email = result.data?.email;
                  let path = ''
                  switch (type) {
                    case 'admin':
                      path = '/admin?cid=' + cid
                      break
                    case 'partner':
                      path = '/partner?cid=' + cid
                      break
                    case 'participant':
                      path = '/participant?cid=' + cid
                      break
                    default:
                      // If user's type is not defined, send them to register page
                      // TODO: Need convert logic for this to .catch since now throwing 404 error
                      router.push('/register?cid=' + cid)
                  }

                  sendEmail(cid, email).then(() => {
                    // The link was successfully sent. Inform the user.
                    window.localStorage.setItem('emailForSignIn', email)
                    router.push('/email-sent');
                  }).catch((error) => {
                    console.error("Error occured while sending email");
                    console.error(error);
                  });
                  // end
              })
              .catch((error) => {
                console.log(error)
              })
            }
          }
          if (!!error) {
            // Commented error to prevent spamming the console
            // console.info(error)
          }
        }}
        style={{ width: '100%' }}
      />
    </>
  )
}

export default function Scan() {
  return (
    <>
      <ContainerMobile>
        <Heading headerType="h2" className="mt-6">
          SCAN QR TO ENTER
        </Heading>
        <p className="mt-2 inline-flex text-blue-600">
          <InformationCircleIcon className="mr-3 h-6 w-6"></InformationCircleIcon>
          <span>Do enable camera permissions</span>
        </p>
        <QRScanner />
        <Button href="/login" className="mt-5 w-full">
          Back
        </Button>
      </ContainerMobile>
    </>
  )
}
