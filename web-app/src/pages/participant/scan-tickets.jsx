import React, { useState } from 'react'
import { ContainerMobile } from '@/components/ContainerMobile'
import { Button } from '@/components/Button'
import { Heading } from '@/components/Heading'
import { Paragraph } from '@/components/Paragraph'
import { QrReader } from 'react-qr-reader'
import { InformationCircleIcon } from '@heroicons/react/24/outline'

export default function Scan() {
  const [data, setData] = useState('No result')
  let [ticketRes, setTicketRes] = useState('')
  let [msg, setMsg] = useState('')

  const QRScanner = (props) => {
    return (
      <>
        <QrReader
          onResult={async (result, error) => {
            if (!!result) {
              setData(result?.text)
              // detect whether the result is a valid CID
              const regex = /^aisdc/

              if (regex.test(result)) {
                await fetch('https://random-data-api.com/api/v2/users?size=1')
                  .then((res) => {
                    setTicketRes('s')
                    setMsg('Ticket verified for booth!')
                    const profile = res.json()
                    console.log(profile)
                  })
                  .catch(() => {
                    setTicketRes('f')
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
          className={ticketRes === 's' ? 'mt-1 text-green-600' : 'hidden'}
        >
          {msg}
        </Paragraph>
        <Paragraph
          className={ticketRes === 'f' ? 'mt-1 text-red-600' : 'hidden'}
        >
          Invalid. Please try another.
        </Paragraph>
        <Button href="/participant" className="w-full">
          Back
        </Button>
      </ContainerMobile>
    </>
  )
}
