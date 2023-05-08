import { useState, useEffect } from 'react'
import { Paragraph } from '@/components/Paragraph'
import { TicketIcon } from '@heroicons/react/24/solid'

export function StampsCounter(props) {
  const [currentCount, setCurrentCount] = useState(0)
  const [targetCount, setTargetCount] = useState(props.count)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentCount((prevCount) => {
        const newCount = prevCount + 1
        return newCount < targetCount ? newCount : targetCount // clamp count to target value
      })
    }, 50) // increment every 50ms

    return () => clearInterval(intervalId)
  }, [currentCount, targetCount])

  useEffect(() => {
    setTargetCount(props.count)
  }, [props.count])

  return (
    <div>
      <Paragraph className="text-center">You have: </Paragraph>
      <Paragraph className="flex justify-center text-center text-3xl font-medium">
        <span className="mr-2 text-orange-600">{currentCount}</span>{' '}
        <span>stamps</span>
        <TicketIcon className="ml-3 h-8 w-8 -rotate-45" />
      </Paragraph>
    </div>
  )
}
