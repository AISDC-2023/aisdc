import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { functions } from '@/firebase.js'
import { httpsCallable } from 'firebase/functions'
import { sendEmail } from '@/helpers'
import { ContainerMobile } from '@/components/ContainerMobile'
import { Button } from '@/components/Button'
import { Heading } from '@/components/Heading'
import { QrReader } from 'react-qr-reader'
import { InformationCircleIcon } from '@heroicons/react/24/outline'

const QRScanner = (props) => {
  const router = useRouter()
  return (
    <>
      <QrReader
        constraints={{ facingMode: 'environment' }}
        onResult={async (result, error) => {
          if (!!result) {
            const cid = result?.text;
            // Check if cid is 10 digit alphanumeric
            if (cid && !cid.match(/^[a-zA-Z0-9]{10}$/)) {
              // TODO: Find more elegant way to display this on the page
              alert('Invalid QR Code')
              return
            }
            const func = httpsCallable(functions, 'user-verify')
            func({ cid: cid })
              .then((result) => {
                //TODO : update code for path, test if FB function work first
                let path = ''
                switch (result.data.type) {
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
                    router.push('/register?cid=' + cid)
                }

                // this code will run if switch default not triggered
                sendEmail(cid, result.email)
                router.push('/email-sent')
                // end
              })
              .catch((error) => {
                console.log(error)
              })
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
        <QRScanner></QRScanner>
        <Button href="/login" className="mt-5 w-full">
          Back
        </Button>
      </ContainerMobile>
    </>
  )
}
