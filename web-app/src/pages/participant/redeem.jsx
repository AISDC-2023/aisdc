import { ContainerMobile } from '@/components/ContainerMobile'
import { Heading } from '@/components/Heading'
import Image from 'next/image'
import hologramGif from '@/images/hologram.gif'
import { StampsCounter } from '@/components/participant/StampsCounter'
import { Prize } from '@/components/participant/Prize'
import { Prizes } from '@/components/participant/Prizes'
import { Timeline } from '@/components/participant/Timeline'
import { useState, useEffect } from 'react'
import { functions } from '@/firebase.js'
import { httpsCallable } from 'firebase/functions'
import { useRouter } from 'next/router'

export default function Redeem() {
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

  let [cid, setCid] = useState('')
  let [name, setName] = useState('')
  let [stamps, setStamps] = useState(0)
  let [transactions, setTransactions] = useState([])
  
  useEffect(() => {
    userVerify()
    setCid(window.localStorage.getItem('cid'))
    setName(window.localStorage.getItem('name'))
    const func = httpsCallable(functions, 'user-getInfo')
    func({ cid: cid }).then((r) => {
      console.log(r)

      console.log(r.data.transactions)
      setTransactions(r.data.transactions)
      setStamps(r.data.stampsLeft)
    })
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
            {/* <Timeline title="TRANSACTIONS" list={transactions} /> */}
            {/* <Prizes title="PRIZES" list={prizes}></Prizes> */}
            <p className="text-center font-mono text-xs text-blue-400">{cid}</p>
          </div>
        </div>
      </ContainerMobile>
    </>
  )
}
