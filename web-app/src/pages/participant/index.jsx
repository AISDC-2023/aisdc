import { useEffect, useState } from 'react'
import { ContainerMobile } from '@/components/ContainerMobile'
import { Heading } from '@/components/Heading'
import { Button } from '@/components/Button'
import { CameraIcon, GiftIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import globeGif from '@/images/globe-spinning.gif'
import { StampsCounter } from '@/components/participant/StampsCounter'
import { Timeline } from '@/components/participant/Timeline'
import { functions } from '@/firebase.js'
import { httpsCallable } from 'firebase/functions'

export async function getServerSideProps() {
  const activity = [
    {
      id: 1,
      type: 'applied',
      content: 'Applied to',
      target: 'Front End Developer',
      date: 'Sep 20',
      datetime: '2020-09-20',
    },
    {
      id: 2,
      type: 'redeemed',
      content: 'redeemed to phone screening by',
      target: 'Bethany Blake',
      date: 'Sep 22',
      datetime: '2020-09-22',
    },
    {
      id: 3,
      type: 'completed',
      content: 'Completed phone screening with',
      target: 'Martha Gardner',
      date: 'Sep 28',
      datetime: '2020-09-28',
    },
    {
      id: 4,
      type: 'redeemed',
      content: 'redeemed to interview by',
      target: 'Bethany Blake',
      date: 'Sep 30',
      datetime: '2020-09-30',
    },
    {
      id: 40,
      type: 'redeemed',
      content: 'redeemed to interview by',
      target: 'Bethany Blake',
      date: 'Sep 30',
      datetime: '2020-09-30',
    },
    {
      id: 674,
      type: 'redeemed',
      content: 'redeemed to interview by',
      target: 'Bethany Blake',
      date: 'Sep 30',
      datetime: '2020-09-30',
    },
    {
      id: 5674,
      type: 'redeemed',
      content: 'redeemed to interview by',
      target: 'Bethany Blake',
      date: 'Sep 30',
      datetime: '2020-09-30',
    },
    {
      id: 5764,
      type: 'redeemed',
      content: 'redeemed to interview by',
      target: 'Bethany Blake',
      date: 'Sep 30',
      datetime: '2020-09-30',
    },
    {
      id: 5,
      type: 'completed',
      content: 'Completed interview with',
      target: 'Katherine Snyder',
      date: 'Oct 4',
      datetime: '2020-10-04',
    },
  ]

  useEffect(() => {
  console.log(window.localStorage)
  }, [window])

  return {
    props: {
      activity,
      stamps,
      transactions
    },
  }
}

export default function Participant({ activity, stamps, transactions }) {
  let [cid, setCid] = useState('')
  let [name, setName] = useState('')
  useEffect(() => {
    setCid(window.localStorage.getItem('cid'))
    setName(window.localStorage.getItem('name'))

    const func = httpsCallable(functions, 'user-getInfo')
    func({ cid: cid }).then((result) => {
      console.log(result)
      transactions = result.transactions
      stamps = result.stampsLeft + 1
    })
  })

  return (
    <>
      <ContainerMobile>
        <div className="flex justify-center">
          <Image
            className="w-16"
            src={globeGif}
            alt=""
            priority
            optimized="true"
          />
        </div>

        <Heading headerType="h2" className="text-center">
          WELCOME <span className="uppercase">{name}</span>
          <br />
          LET THE GAMES BEGIN!
        </Heading>
        <div>
          <div className="mt-5 space-y-5">
            <Button
              href="/participant/scan-tickets"
              className="w-full items-center"
              type="button"
            >
              <span>Scan for tickets!</span>
              <CameraIcon className="ml-3 h-6 w-6" />
            </Button>
            <Button
              href="/participant/redeem"
              className="w-full items-center"
              type="button"
            >
              <span>Redeem</span>
              <GiftIcon className="ml-3 h-6 w-6" />
            </Button>
            <StampsCounter count={stamps} />
            <Timeline title="YOUR ACTIVITY" list={activity} />
            <p className="text-center font-mono text-xs text-blue-400">
              {cid}
            </p>
          </div>
        </div>
      </ContainerMobile>
    </>
  )
}
