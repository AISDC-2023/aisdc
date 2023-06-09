import { useEffect, useState } from 'react'
import { ContainerMobile } from '@/components/ContainerMobile'
import { Heading } from '@/components/Heading'
import { Button } from '@/components/Button'
import {
  CameraIcon,
  GiftIcon,
  ComputerDesktopIcon,
} from '@heroicons/react/24/solid'
import Image from 'next/image'
import globeGif from '@/images/globe-spinning.gif'
import { StampsCounter } from '@/components/participant/StampsCounter'
import { Timeline } from '@/components/participant/Timeline'
import { functions } from '@/firebase.js'
import { getUid, getRole } from '@/helpers.js'
import { httpsCallable } from 'firebase/functions'
import { useRouter } from 'next/router'

export default function Participant() {
  const router = useRouter()

  const [cid, setCid] = useState('')
  const [name, setName] = useState('')
  const [stamps, setStamps] = useState(0)
  const [showAdmin, setShowAdmin] = useState(false)
  const [transactions, setTransactions] = useState([])

  function userVerify(id) {
    getRole(id).then((role) => {
      if (role === 'admin') {
        setShowAdmin(true)
      } else if (role === 'participant') {
        setShowAdmin(false)
      } else {
        router.push('/login')
      }
    })
  }

  function retrieveInfo(id) {
    const func = httpsCallable(functions, 'user-getInfo')
    func({ cid: id }).then((r) => {
      setTransactions(r.data.transactions)
      setStamps(r.data.stampCount)
    })
  }

  useEffect(() => {
    getUid().then((uid) => {
      if (!uid) {
        router.push('/login')
      }
      setCid(uid)
      const n = window.localStorage.getItem('name')
      setName(n)
      userVerify(uid)
      retrieveInfo(uid)
    })
  }, [router])

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
            {showAdmin ? (
              <Button
                href="/admin"
                className="w-full items-center"
                type="button"
              >
                Go To Admin
              </Button>
            ) : null}
            <Button
              href="/participant/scan"
              className="w-full items-center"
              type="button"
            >
              <span>Scan for stamps!</span>
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
            <Button
              href="/participant/workshops"
              className="w-full items-center"
              type="button"
            >
              <span>Workshops</span>
              <ComputerDesktopIcon className="ml-3 h-6 w-6" />
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
