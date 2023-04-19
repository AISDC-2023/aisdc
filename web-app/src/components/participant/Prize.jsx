import { useState } from 'react'
import Image from 'next/image'
import Cookie from '@/images/fortune-cookie.png'
import { Button } from '@/components/Button'
import { SparklesIcon } from '@heroicons/react/24/solid'
import { InformationCircleIcon } from '@heroicons/react/24/outline'

export function Prize() {
  const [isClicked, setIsClicked] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const handleClick = () => {
    setIsExpanded(!isExpanded)

    // if already clicked, do nothing
    if (!isClicked) {
      setIsClicked(true)
    }
  }

  const handleAgain = () => {
    setIsClicked(false)
  }

  return (
    <div>
      <div className="flex justify-center">
        <div class className="relative self-center">
        <div
          className={`absolute inset-0 h-24 w-24 transform rounded-md bg-blue-500 text-white transition-transform ${
            isExpanded ? '-translate-x-12' : ''
          }`}
        >
          <button className="h-full w-full" onClick={handleClick}>
            Click Me!
          </button>
          </div>
        </div>
        <Image
          src={Cookie}
          className={`w-48 transition-all duration-[3000ms] ${
            isClicked ? '-translate-x-64' : ''
          }`}
          alt=""
          priority
          optimized="true"
          onClick={handleClick}
        />
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
