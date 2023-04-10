import React, { useState } from 'react'
import { HeadMeta } from '@/components/HeadMeta'
import { Button } from '@/components/Button'
import { Header } from '@/components/Header'
import { QrReader } from 'react-qr-reader'

const QRScanner = (props) => {
  const [data, setData] = useState('No result')

  return (
    <>
      <QrReader
        onResult={async (result, error) => {
          if (!!result) {
            setData(result?.text)
            // detect whether the result is a valid CID
            const regex = /^cid/

            if (regex.test(result)) {
              // send to server and redirect
              const res = await fetch('https://random-data-api.com/api/v2/users?size=1')
              const profile = await res.json()
            
              switch (profile.id) {
                case 'admin':
                  window.location.href = '/admin'
                  break
                case 'partner':
                  window.location.href = '/partner'
                  break
                default:
                  window.location.href = '/participant'
            }
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
      <HeadMeta />
      <Header />
      <main>
        <div className="flex min-h-full">
          <div className="mx-auto flex flex-1 flex-col justify-center px-4 py-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
            <div className="mx-auto w-full max-w-sm lg:w-96">
              <div>
                <h2 className="mt-6 text-3xl font-bold tracking-tight text-blue-900">
                  Scan QR
                </h2>
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
              </div>
              <QRScanner></QRScanner>
              <Button href="/login" className="w-full">
                Back
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
