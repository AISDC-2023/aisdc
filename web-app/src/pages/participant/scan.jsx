import React, { useState, useRef } from 'react'
import { ContainerMobile } from '@/components/ContainerMobile'
import { Button } from '@/components/Button'
import { Heading } from '@/components/Heading'
import { Paragraph } from '@/components/Paragraph'
import { QrReader } from 'react-qr-reader'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { functions } from '@/firebase.js'
import { httpsCallable } from 'firebase/functions'
import { useRouter } from 'next/router'

export default function Scan() {
  const router = useRouter()

  // ensure only for participant/ admin
  function userVerify() {
    const cid = window.localStorage.getItem('cid')
    console.log(cid)
    if (cid !== null) {
      const func = httpsCallable(functions, 'user-verify')
      func({ cid: cid })
        .then((result) => {
          const type = result.data?.type
          if (type === 'admin' || type === 'participant') {
            console.log('alala')
            return true
          } else {
            router.push('/login')
          }
        })
        .catch((error) => {
          console.log(error)
          router.push('/login')
        })
    } else {
      router.push('/login')
    }
  }

  let [ticketRes, setTicketRes] = useState('')
  let [msg, setMsg] = useState('')
  const scanSidRef = useRef(null)

  const QRScanner = (props) => {
    return (
      <>
        <QrReader
          style={{ width: '100%' }}
          constraints={{ facingMode: 'environment' }}
          scanDelay={1000}
          onResult={async (result, error) => {
            if (!!result) {
              const sid = result?.text
              // Check if sid is 20 digit alphanumeric
              if (sid && !sid.match(/^[a-zA-Z0-9]{20}$/)) {
                // stop the code from sending to server if invalid
                return
              }

              // if sid is new then process
              if (scanSidRef.current !== sid) {
                // valid sid so set
                scanSidRef.current = sid
                const func = httpsCallable(functions, 'stamp-redeem')
                func({ sid: sid })
                  .then((result) => {
                    // null response
                    console.log(result)
                    setTicketRes('s')
                    setMsg('Ticket verified for booth!')
                  })
                  .catch((error) => {
                    setTicketRes('f')
                    console.log(error)
                  })
              }
            }
            if (!!error) {
              // console.info(error)
            }
          }}
        />
      </>
    )
  }

  return (
    <>
      <ContainerMobile>
        <Heading headerType="h2" className="mt-6">
          SCAN FOR TICKETS
        </Heading>
        <p className="mt-2 inline-flex text-blue-600">
          <InformationCircleIcon className="mr-3 h-6 w-6"></InformationCircleIcon>
          <span>Do enable camera permissions</span>
        </p>
        <QRScanner></QRScanner>
        <Paragraph
          className={
            ticketRes === 's' ? 'mt-1 text-center text-green-600' : 'hidden'
          }
        >
          {msg}
        </Paragraph>
        <Paragraph
          className={
            ticketRes === 'f' ? 'mt-1 text-center text-red-600' : 'hidden'
          }
        >
          Invalid. You might have scanned before.
        </Paragraph>
        <Button href="/participant" className="mt-3 w-full">
          Back
        </Button>
      </ContainerMobile>
    </>
  )
}
