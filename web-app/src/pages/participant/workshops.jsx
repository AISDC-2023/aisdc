import { useEffect, useState } from 'react'
import { ContainerMobile } from '@/components/ContainerMobile'
import { Heading } from '@/components/Heading'
import { Paragraph } from '@/components/Paragraph'
import { Button } from '@/components/Button'
import Image from 'next/image'
import globeGif from '@/images/globe-spinning.gif'
import { functions } from '@/firebase.js'
import { httpsCallable } from 'firebase/functions'
import { getUid, getRole } from '@/helpers.js'
import { useRouter } from 'next/router'
import { PaperAirplaneIcon, UserMinusIcon } from '@heroicons/react/24/solid'

export default function Participant() {
  const router = useRouter()

  const [cid, setCid] = useState('')
  const [name, setName] = useState('')
  const [res, setRes] = useState(false)
  const [list, setWorkshops] = useState([])

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
    // assume get workshop
    const func = httpsCallable(functions, 'workshop-list')
    func({ cid: id }).then((r) => {
      setWorkshops(r.data)
    })
  }

  function timeout() {
    setTimeout(() => {
      setRes(false)
    }, 3000)
  }

  const Unregistered = (props) => {
    function clickRegister() {
      const func = httpsCallable(functions, 'workshop-register')
      const wid = props.wid
      func({ wid })
        .then((r) => {
          setRes(true)
          timeout()
          retrieveInfo(cid)
        })
        .catch((e) => {
          // console.log(e)
        })
    }

    return (
      <Button
        onClick={clickRegister}
        className="mt-3 w-full items-center"
        type="button"
      >
        <span>Register</span>
        <PaperAirplaneIcon className="ml-3 h-6 w-6" />
      </Button>
    )
  }

  const Registered = (props) => {
    function clickUnregister() {
      const func = httpsCallable(functions, 'workshop-unregister')
      const wid = props.wid
      func({ wid })
        .then((r) => {
          setRes(true)
          timeout()
          retrieveInfo(cid)
        })
        .catch((e) => {
          // console.log(e)
        })
    }

    return (
      <Button
        onClick={clickUnregister}
        className="mt-3 w-full items-center bg-red-500"
        type="button"
      >
        <span>Unregister</span>
        <UserMinusIcon className="ml-3 h-6 w-6" />
      </Button>
    )
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
          WORKSHOPS FOR YOU, <span className="uppercase">{name}</span>?
        </Heading>
        <Paragraph className="mt-1 text-center">
          <span>&nbsp;</span>
          <span className={res ? 'text-green-600' : 'hidden'}>
            Operation Success
          </span>
          <span>&nbsp;</span>
        </Paragraph>
        <div>
          <div className="mt-5 space-y-5">
            {list.length > 0
              ? list.map((item, itemIdx) => (
                  <div key={item.id}>
                    <Heading headerType="h3">{item.name}</Heading>
                    <Paragraph>{item.description}</Paragraph>
                    <br />
                    <Paragraph>
                      Slots left: <strong>{item.slotsLeft}</strong>
                    </Paragraph>
                    {item.registered ? (
                      <Registered wid={item.id} />
                    ) : item.slotsLeft > 0 ? (
                      <Unregistered wid={item.id} />
                    ) : null}
                  </div>
                ))
              : null}
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
