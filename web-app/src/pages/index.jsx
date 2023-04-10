import { Hero } from '@/components/index/Hero'
import { Schedule } from '@/components/index/Schedule'
import { Speakers } from '@/components/index/Speakers'
import { Sponsors } from '@/components/index/Sponsors'

export default function Home() {
  return (
    <>
      <Hero />
      <Speakers />
      <Schedule />
      <Sponsors />
    </>
  )
}
