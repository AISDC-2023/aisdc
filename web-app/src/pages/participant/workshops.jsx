import { useEffect, useState } from 'react'
import { ContainerMobile } from '@/components/ContainerMobile'
import { Heading } from '@/components/Heading'
import { Paragraph } from '@/components/Paragraph'
import { Button } from '@/components/Button'
import Image from 'next/image'
import globeGif from '@/images/globe-spinning.gif'
import { functions } from '@/firebase.js'
import { httpsCallable } from 'firebase/functions'
import { useRouter } from 'next/router'
import { PaperAirplaneIcon, UserMinusIcon } from '@heroicons/react/24/solid'

export default function Participant() {
  const router = useRouter()

  const [cid, setCid] = useState('')
  const [name, setName] = useState('')
  const [list, setWorkshops] = useState([])

  function userVerify(id) {
    // ensure only for participant/ admin
    const func = httpsCallable(functions, 'user-verify')
    func({ cid: id })
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
    // assume get workshop
    const func = httpsCallable(functions, 'user-getInfo')
    func({ cid: id }).then((r) => {
      const d = [
        {
          id: '123',
          name: 'efew',
          description: 'dsfsf',
          slotsLeft: 2,
          registered: false,
          registeredTime: null,
        },
        {
          id: '45656',
          name: 'lalaa',
          description: 'dsfsf',
          slotsLeft: 0,
          registered: true,
          registeredTime: '20121212',
        },
      ]
      setWorkshops(d)
      console.log(r)
    })
  }

  const handleClick = () => {
    // if already clicked, do nothing
    // if (stamps > 0) {

    const func = httpsCallable(functions, 'prize-draw')
    func()
      .then((r) => {
        retrieveInfo(cid)
      })
      .catch((e) => {
        // showNoError(false)
      })
  }

  useEffect(() => {
    const id = window.localStorage.getItem('cid')
    const n = window.localStorage.getItem('name')
    setCid(id)
    setName(n)

    userVerify(id)
    retrieveInfo(id)
  }, [])

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
          WORKSHOPS FOR YOU, <span className="uppercase">{name}</span>?
        </Heading>
        <div>
          <div className="mt-5 space-y-5">
            {list.length > 0
              ? list.map((item, itemIdx) => (
                  <div key={item.id}>
                    <Heading headerType="h3">{item.name}</Heading>
                    <Paragraph>{item.description}</Paragraph>
                    <Paragraph>Time: {item.time}</Paragraph>
                    <Paragraph>Slots left: {item.slotsLeft}</Paragraph>
                    {item.registered ? (
                      <Button
                        onClick={handleClick(false, itemIdx)}
                        className="mt-3 w-full items-center bg-red-500"
                        type="button"
                      >
                        <span>Unregister</span>
                        <UserMinusIcon className="ml-3 h-6 w-6" />
                      </Button>
                    ) : item.slotsLeft > 0 ? (
                      <Button
                        onClick={handleClick(false, itemIdx)}
                        className="mt-3 w-full items-center"
                        type="button"
                      >
                        <span>Register</span>
                        <PaperAirplaneIcon className="ml-3 h-6 w-6" />
                      </Button>
                    ) : null}
                  </div>
                ))
              : null}
            <p className="text-center font-mono text-xs text-blue-400">{cid}</p>
          </div>
        </div>
      </ContainerMobile>
    </>
  )
}
