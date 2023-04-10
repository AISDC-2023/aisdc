import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { ContainerMobile } from '@/components/ContainerMobile'
import { Button } from '@/components/Button'
import { Heading } from '@/components/Heading'
import { QrReader } from 'react-qr-reader'

const QRScanner = (props) => {
  const [data, setData] = useState('No result')
  const router = useRouter()
  return (
    <>
      <QrReader
        onResult={async (result, error) => {
          if (!!result) {
            setData(result?.text)
            // detect whether the result is a valid CID
            const regex = /^cid/

            if (regex.test(result)) {
              await fetch('https://random-data-api.com/api/v2/users?size=1')
                .then((res) => {
                  setAuthRes('s')
                  const profile = res.json()
                  switch (profile.id) {
                    case 'admin':
                      router.push('/admin?cid=' + cid)
                      break
                    case 'partner':
                      router.push('/partner?cid=' + cid)
                      break
                    default:
                      router.push('/participant?cid=' + cid)
                  }
                })
                .catch(() => {
                  setAuthRes('f')
                })
            }
          }
          if (!!error) {
            console.info(error)
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
          SCAN QR
        </Heading>
        <p className="mt-2 inline-flex text-blue-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="mr-3 h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
            />
          </svg>
          <span>Do enable camera permissions</span>
        </p>
        <QRScanner></QRScanner>
        <Button href="/login" className="w-full">
          Back
        </Button>
      </ContainerMobile>
    </>
  )
}
