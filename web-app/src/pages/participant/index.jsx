import { ContainerMobile } from '@/components/ContainerMobile'
import { Heading } from '@/components/Heading'
import { Button } from '@/components/Button'
import { CameraIcon, GiftIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import globeGif from '@/images/globe-spinning.gif'
import { StampsCounter } from '@/components/participant/stamps-counter'
import { Timeline } from '@/components/Participant/Timeline'

export async function getStaticProps() {
  // Call an external API endpoint to get posts
  const res = await fetch('https://random-data-api.com/api/v2/users?size=1')
  const profile = await res.json()
  console.log(profile)
  return {
    props: {
      profile,
    },
  }
}

export default function Participant({ profile }) {
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
          LET THE GAMES BEGIN!
        </Heading>
        <div>
          <div className="mt-5 space-y-5">
            <Button
              href="/participant/scan-tickets"
              className="w-full items-center"
              type="button"
            >
              <span>Scan for tickets!</span>
              <CameraIcon className="ml-3 h-6 w-6" />
            </Button>
            <Button
              href="/participant/redeem"
              className="w-full items-center"
              type="button"
            >
              <span>Redeem</span>
              <GiftIcon className="ml-3 h-6 w-6" />
            </Button>
            <StampsCounter count="10" />
            <Timeline />
            <p className="text-center font-mono text-xs text-blue-400">
          {profile.uid}
        </p>
          </div>
        </div>
      </ContainerMobile>
    </>
  )
}
