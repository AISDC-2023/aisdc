import { useState } from 'react'
import Image from 'next/image'
import Cookie from '@/images/fortune-cookie.png'
import { Button } from '@/components/Button'
import { SparklesIcon } from '@heroicons/react/24/solid'
import { InformationCircleIcon } from '@heroicons/react/24/outline'

export function Prize() {
  const [isClicked, setIsClicked] = useState(false)
  const [prizeName, setPrize] = useState('')
  const handleClick = () => {
    // if already clicked, do nothing
    if (!isClicked) {
      setPrize('Congratuations! 1 year to Netflix!')
      setIsClicked(true)
    }
  }

  const handleAgain = () => {
    setIsClicked(false)
  }

  return (
    <div>
      <div className="flex justify-center">
        <Image
          src={Cookie}
          className={`z-10 w-48 justify-self-center transition-all duration-[3000ms] ${
            isClicked ? '-translate-x-64' : ''
          }`}
          alt=""
          priority
          optimized="true"
          onClick={handleClick}
        />
        <div className="relative justify-end self-center">
          <div
            className={`absolute inset-0 -ml-16 h-14 transform rounded-md bg-blue-500 text-white transition-all duration-[3000ms] ${
              isClicked ? 'w-96 -translate-x-64' : 'w-0.5'
            }`}
          >
            <div className="h-full w-full whitespace-nowrap pr-10 text-right">
              <p className="py-3.5">{prizeName}</p>
            </div>
          </div>
        </div>
      </div>

      <p
        className={`text-center text-sm text-blue-600 ${
          isClicked ? 'hidden' : ''
        }`}
      >
        <span className="inline-flex items-center">
          <InformationCircleIcon className="mr-2 h-5 w-5" />
          Click cookie for fortune
        </span>
      </p>
      <Button
        onClick={handleAgain}
        className={`w-full items-center ${isClicked ? '' : 'hidden'}`}
        type="button"
      >
        <span>Again!</span>
        <SparklesIcon className="ml-3 h-6 w-6" />
      </Button>
    </div>
  )
}
