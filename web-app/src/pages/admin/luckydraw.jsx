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
  const [names2, setNames2] = useState([])
  const [names3, setNames3] = useState([])
  const [initialLoad, setInitialLoad] = useState(false)

  useEffect(() => {
    userlistfunc({})
      .then((res) => {
        const participants = res.data.users.filter(
          (user) => user.type === 'participant'
        )
        setNames(participants)
        setNames2(participants)
        setNames3(participants)
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

  function restartRaffle() {
    setInitialLoad(false);
    const remainingNames = names2.filter((name) => !names.includes(name))
    if (remainingNames.length <= 1) { resetNames() }
    else {
      setNames(remainingNames)
      setNames2(remainingNames)
    }
  }

  function resetNames() {
    if (window.confirm(`Are you sure you want to reset all the names?`)) {
      setInitialLoad(false);
      setNames(names3);
      setNames2(names3);
    }
  }

  return (
    <>
      <ContainerMobile>
        <Button href="/admin" style={{ textDecoration: 'none' }}>
          {' '}Back{' '}
        </Button>
        <div className="mt-3 flex justify-center">
          <Heading headerType="h2" className="mt-4">Lucky Draw</Heading>
        </div>
        <div className="mt-3 space-x-4 flex justify-center">
          <Button onClick={() => setNames(shuffle(names))}> Shuffle </Button>
          <Button onClick={startRaffle}> Start </Button>
        </div>
        <div className="mt-3 space-x-4 flex justify-center">
          <Button className="button-outline" onClick={restartRaffle}> Next </Button>
          <Button className="button-outline" onClick={resetNames}> Reset Names </Button>
        </div>

        <div className="mt-5 flex justify-center">
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
          <Heading headerType="h2" className="mt-6 flex justify-center">
            Congrats to the winner!
          </Heading>
          <div className="mt-5 flex justify-center">
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
