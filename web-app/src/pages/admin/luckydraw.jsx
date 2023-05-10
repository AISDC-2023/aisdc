import React, { useState, useEffect } from 'react'
import { ContainerMobile } from '@/components/ContainerMobile'
import { Button } from '@/components/Button'
import { Heading } from '@/components/Heading'
import shuffle from 'lodash/shuffle'
import { functions } from '@/firebase.js'
import { httpsCallable } from 'firebase/functions'
import { Transition } from '@headlessui/react'

const userlistfunc = httpsCallable(functions, 'user-list')

const Luckydraw = () => {
  const [names, setNames] = useState([])
  const [initialLoad, setInitialLoad] = useState(false)

  useEffect(() => {
    userlistfunc({})
      .then((res) => {
        const participants = res.data.users.filter(
          (user) => user.type === 'participant'
        )
        setNames(participants)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  useEffect(() => {
    if (initialLoad) {
      const filteringTimer = setTimeout(() => {
        startRaffle()
      }, 300)
      return () => {
        clearTimeout(filteringTimer)
      }
    }
  }, [initialLoad, names, startRaffle])

  function startRaffle() {
    if (names.length <= 1) {
      return
    }
    const randomIndex = Math.floor(Math.random() * names.length)
    const filterOutNames = names.filter((name) => name !== names[randomIndex])
    setNames(filterOutNames)
    setInitialLoad(true)
  }
  return (
    <>
      <ContainerMobile>
        <Button href="/admin" style={{ textDecoration: 'none' }}>
          {' '}
          Back{' '}
        </Button>
        <Heading headerType="h2">Lucky Draw</Heading>
        <div className="mt-3 space-x-2">
          <Button onClick={startRaffle}> Start Lucky Draw </Button>
          <Button onClick={() => setNames(shuffle(names))}> Shuffle </Button>
        </div>
        <div className="mt-5">
          <Transition
            show={names.length > 0}
            enter="transition-opacity duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            {names.map((names, index) => (
              <span
                key={index}
                className="mr-3 mt-2 inline-flex items-center rounded-md bg-orange-100 px-2 py-1 text-sm font-medium text-yellow-800"
              >
                {names.name}
              </span>
            ))}
          </Transition>
        </div>

        <Transition
          show={names.length === 1}
          enter="transition-opacity duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Heading headerType="h2" className="mt-6">
            Congrats to the winner!
          </Heading>
          <div className="mt-5">
            <Heading headerType="h1" className="text-orange-600">
              {' '}
              {names[0]?.name}{' '}
            </Heading>
          </div>
        </Transition>
      </ContainerMobile>
    </>
  )
}

export default Luckydraw
