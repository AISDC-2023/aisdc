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
import { useRouter } from 'next/router'

export default function Participant() {
  const router = useRouter()

  let [cid, setCid] = useState('')
  let [name, setName] = useState('')
  let [stamps, setStamps] = useState(0)
  let [transactions, setTransactions] = useState([])

  useEffect(() => {
    setCid(window.localStorage.getItem('cid'))
    setName(window.localStorage.getItem('name'))
    // ensure only for participant/ admin
    function userVerify() {
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
    userVerify()

    const func = httpsCallable(functions, 'user-getInfo')
    func({ cid: cid }).then((r) => {
      setTransactions(r.data.transactions)
      setStamps(r.data.stampsLeft + 1)
    })
  }, [router, cid])

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
              href="/participant/scan"
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
            <Timeline title="YOUR ACTIVITY" list={transactions} />
            <p className="text-center font-mono text-xs text-blue-400">{cid}</p>
          </div>
        </div>
      </ContainerMobile>
    </>
  )
}
