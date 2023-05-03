import { useState } from 'react'
import Image from 'next/image'
import Cookie from '@/images/fortune-cookie.png'
import { Button } from '@/components/Button'
import { SparklesIcon } from '@heroicons/react/24/solid'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { Paragraph } from '@/components/Paragraph'
import { functions } from '@/firebase.js'
import { httpsCallable } from 'firebase/functions'

export function Prize({ stamps }) {
  const [isClicked, setIsClicked] = useState(false)
  const [isDrawn, setIsDrawn] = useState(false)
  const [prizeName, setPrize] = useState('')
  const [noError, showNoError] = useState(true)
  const handleClick = () => {
    setIsClicked(true)
    // if already clicked, do nothing
    if (stamps > 0) {
      if (!isClicked) {
        const func = httpsCallable(functions, 'prize-draw')
        func()
          .then((r) => {
            console.log()
            const s = `Congratuations! You won ${r.data.pid.name}`
            setPrize(s)
            setIsDrawn(true)
          })
          .catch((e) => {
            showNoError(false)
          })
      }
    }
  }

  const handleAgain = () => {
    setIsClicked(false)
    setIsDrawn(false)
  }

  return (
    <>
      {stamps > 0 ? (
        noError ? (
          <div>
            <div className="flex justify-center">
              <Image
                src={Cookie}
                className={`z-10 w-48 cursor-pointer justify-self-center transition-all duration-[3000ms] ${
                  isDrawn ? '-translate-x-64 cursor-default' : ''
                }`}
                alt=""
                priority
                optimized="true"
                onClick={handleClick}
              />
              <div className="relative justify-end self-center">
                <div
                  className={`absolute inset-0 -ml-16 h-14 transform rounded-md bg-blue-500 text-white transition-all duration-[3000ms] ${
                    isDrawn ? '-ml-5 w-fit -translate-x-64' : 'w-0.5'
                  }`}
                >
                  <div className="h-full w-full whitespace-nowrap px-10 text-right">
                    <p className="py-3.5">{prizeName}</p>
                  </div>
                </div>
              </div>
            </div>

            <p
              className={`text-center text-sm text-blue-600 ${
                isDrawn ? 'hidden' : ''
              }`}
            >
              <span className="inline-flex items-center">
                <InformationCircleIcon className="mr-2 h-5 w-5" />
                Click cookie for fortune
              </span>
            </p>
            <Button
              onClick={handleAgain}
              className={`w-full items-center ${isDrawn ? '' : 'hidden'}`}
              type="button"
            >
              <span>Again!</span>
              <SparklesIcon className="ml-3 h-6 w-6" />
            </Button>
          </div>
        ) : (
          <Paragraph className="text-center font-semibold text-orange-600">
            Error. Please try again
          </Paragraph>
        )
      ) : (
        <Paragraph className="text-center font-semibold text-orange-600">
          More stamps needed to redeem!
        </Paragraph>
      )}
    </>
  )
}
