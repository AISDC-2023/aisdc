import { useState, useEffect } from 'react'
import { Paragraph } from '@/components/Paragraph'

export function StampsCounter(props) {
  const [currentCount, setCurrentCount] = useState(0)
  const [targetCount, setTargetCount] = useState(props.count)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentCount((prevCount) => {
        const newCount = prevCount + 1
        return newCount < targetCount ? newCount : targetCount // clamp count to target value
      })
    }, 100) // increment count every 200 milliseconds

    return () => clearInterval(intervalId)
  }, [currentCount, targetCount])

  useEffect(() => {
    setTargetCount(props.count)
  }, [props.count])

  return (
    <div>
      <Paragraph className="text-center">You have: </Paragraph>
      <Paragraph className="text-center text-3xl font-medium">
        <span className="text-orange-600">{currentCount}</span> stamps
      </Paragraph>
    </div>
  )
}
