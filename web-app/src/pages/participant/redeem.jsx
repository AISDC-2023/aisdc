import { ContainerMobile } from '@/components/ContainerMobile'
import { Heading } from '@/components/Heading'
import Image from 'next/image'
import hologramGif from '@/images/hologram.gif'
import { StampsCounter } from '@/components/participant/StampsCounter'
import { Prize } from '@/components/participant/Prize'
import { Prizes } from '@/components/participant/Prizes'
import { useState, useEffect } from 'react'
import { functions } from '@/firebase.js'
import { httpsCallable } from 'firebase/functions'
import { useRouter } from 'next/router'

export default function Redeem() {
  const router = useRouter()

  let [cid, setCid] = useState('')
  let [name, setName] = useState('')
  let [stamps, setStamps] = useState(0)
  let [prizes, setPrizes] = useState([])

  function userVerify() {
    const func = httpsCallable(functions, 'user-verify')
    func({ cid: window.localStorage.getItem('cid') })
      .then((result) => {
        const type = result.data?.type
        if (type === 'admin' || type === 'participant') {
          return true
        } else {
          router.push('/login')
        }
      })
      .catch((error) => {
        console.log(error)
        router.push('/login')
      })
  }

  function retrieveInfo(id) {
    const func = httpsCallable(functions, 'user-getInfo')
    func({ cid: id }).then((r) => {
      setStamps(r.data.stampCount)
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
    const id = window.localStorage.getItem('cid')
    const n = window.localStorage.getItem('name')

    setCid(id)
    setName(n)
    retrievePrizes()
    userVerify(id)
    retrieveInfo(id)
  }, [])

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
            <Prize stamps={stamps}></Prize>
            <Prizes title="PRIZES" list={prizes}></Prizes>
            <p className="text-center font-mono text-xs text-blue-400">{cid}</p>
          </div>
        </div>
      </ContainerMobile>
    </>
  )
}
