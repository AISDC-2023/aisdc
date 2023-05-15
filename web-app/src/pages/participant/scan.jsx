import React, { useState, useRef, useEffect } from 'react'
import { ContainerMobile } from '@/components/ContainerMobile'
import { Button } from '@/components/Button'
import { Heading } from '@/components/Heading'
import { Paragraph } from '@/components/Paragraph'
import { QrReader } from 'react-qr-reader'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { functions } from '@/firebase.js'
import { httpsCallable } from 'firebase/functions'
import { getUid, getRole } from '@/helpers.js'
import { useRouter } from 'next/router'

export default function Scan() {
  const router = useRouter()

  function userVerify(id) {
    getRole(id).then((role) => {
      if (role === 'admin' || role === 'participant') {
        // do nth
      } else {
        router.push('/login')
      }
    })
  }

  useEffect(() => {
    getUid().then((uid) => {
      if (!uid) {
        router.push('/login')
      }
      userVerify(uid)
    })
  }, [router])

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
                    setTicketRes('s')
                    setMsg('Ticket verified for booth!')
                    setTimeout(() => {
                      router.push('/participant')
                    }, 2000)
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
