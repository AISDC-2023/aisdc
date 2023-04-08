import { HeadMeta } from '@/components/HeadMeta'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Hero } from '@/components/index/Hero'
import { Schedule } from '@/components/index/Schedule'
import { Speakers } from '@/components/index/Speakers'
import { Sponsors } from '@/components/index/Sponsors'

export default function Home() {
  return (
    <>
      <HeadMeta />
      <Header />
      <main>
        <Hero />
        <Speakers />
        <Schedule />
        <Sponsors />
      </main>
      <Footer />
    </>
  )
}
