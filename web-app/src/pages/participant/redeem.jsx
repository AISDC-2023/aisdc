import { ContainerMobile } from '@/components/ContainerMobile'
import { Heading } from '@/components/Heading'
import { Button } from '@/components/Button'
import Image from 'next/image'
import hologramGif from '@/images/hologram.gif'
import { StampsCounter } from '@/components/participant/StampsCounter'
import { Prize } from '@/components/participant/Prize'
import { Prizes } from '@/components/participant/Prizes'
import { useState, useEffect } from 'react'
import { functions } from '@/firebase.js'
import { getUid, getRole } from '@/helpers.js'
import { httpsCallable } from 'firebase/functions'
import { useRouter } from 'next/router'

export default function Redeem() {
  const router = useRouter()

  let [cid, setCid] = useState('')
  let [name, setName] = useState('')
  let [stamps, setStamps] = useState(0)
  let [prizes, setPrizes] = useState([])
  let [unredeem, setUnredeem] = useState([])

  function userVerify(id) {
    getRole(id).then((role) => {
      if (role === 'admin' || role === 'participant') {
        // do nth
      } else {
        router.push('/login')
      }
    })
  }

  function retrieveInfo(id) {
    let idn = null
    if (!id) {
      idn = cid
    } else {
      idn = id
    }
    const func = httpsCallable(functions, 'user-getInfo')
    func({ cid: idn }).then((r) => {
      setStamps(r.data.stampCount)
      // only show unredeemed prizes from array object
      const unredeemed = r.data.prizes.filter((p) => p.redeemed === false)
      setUnredeem(unredeemed)
    })
  }

  function retrievePrizes() {
    const func = httpsCallable(functions, 'prize-get')
    func({}).then((r) => {
      // convert object of objects to array
      let a = []
      for (const [key, value] of Object.entries(r.data.prizes)) {
        a.push(value)
      }
      setPrizes(a)
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
      retrievePrizes()
      userVerify(uid)
      retrieveInfo(uid)
    })
  }, [router])

  return (
    <>
      <ContainerMobile>
        <div className="flex justify-center">
          <Image
            className="w-32"
            src={hologramGif}
            alt=""
            priority
            optimized="true"
          />
        </div>

        <Heading headerType="h2" className="text-center">
          AYE AYE {name}!
        </Heading>
        <div>
          <div className="mt-5 space-y-5">
            <StampsCounter count={stamps} />
            <Prize stamps={stamps} click={retrieveInfo}></Prize>
            <Prizes title="UNREDEEMED" list={unredeem}></Prizes>
            <Prizes title="PRIZES" list={prizes}></Prizes>
            <Button href="/participant" className="mt-3 w-full">
              Back
            </Button>
            <p className="text-center font-mono text-xs text-blue-400">{cid}</p>
          </div>
        </div>
      </ContainerMobile>
    </>
  )
}
