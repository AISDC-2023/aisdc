import { ContainerMobile } from '@/components/ContainerMobile'
import { Heading } from '@/components/Heading'
import Image from 'next/image'
import hologramGif from '@/images/hologram.gif'
import { StampsCounter } from '@/components/participant/StampsCounter'
import { SpinningWheel } from '@/components/participant/SpinningWheel'
import { Timeline } from '@/components/participant/Timeline'

export async function getStaticProps() {
  const activity = [
    {
      id: 4,
      type: 'redeemed',
      content: 'redeemed to interview by',
      target: 'Bethany Blake',
      date: 'Sep 30',
      datetime: '2020-09-30',
    },
    {
      id: 40,
      type: 'redeemed',
      content: 'redeemed to interview by',
      target: 'Bethany Blake',
      date: 'Sep 30',
      datetime: '2020-09-30',
    },
    {
      id: 674,
      type: 'redeemed',
      content: 'redeemed to interview by',
      target: 'Bethany Blake',
      date: 'Sep 30',
      datetime: '2020-09-30',
    },
    {
      id: 5674,
      type: 'redeemed',
      content: 'redeemed to interview by',
      target: 'Bethany Blake',
      date: 'Sep 30',
      datetime: '2020-09-30',
    },
  ]

  // Call an external API endpoint to get posts
  const res = await fetch('https://random-data-api.com/api/v2/users?size=1')
  const profile = await res.json()
  console.log(profile)
  return {
    props: {
      profile,
      activity,
    },
  }
}

export default function Redeem({ profile, activity }) {
  function spinWheel() {
    alert('Spinning the wheel!')
  }

  return (
    <>
      <ContainerMobile>
        <div className="flex justify-center">
          <Image
            className="w-32"
            src={hologramGif}
            alt=""
            priority
            optimized="true"
          />
        </div>

        <Heading headerType="h2" className="text-center">
          AYE AYE CAPTAIN!
        </Heading>
        <div>
          <div className="mt-5 space-y-5">
            <StampsCounter count="10" />
            <SpinningWheel></SpinningWheel>
            {/* <Button
              href="/participant/scan-tickets"
              className="w-full items-center"
              type="button"
            >
              <span>Scan for tickets!</span>
              <CameraIcon className="ml-3 h-6 w-6" />
            </Button> */}
            <Timeline title="REDEMPTION HISTORY" timeline={activity} />
            <p className="text-center font-mono text-xs text-blue-400">
              {profile.uid}
            </p>
          </div>
        </div>
      </ContainerMobile>
    </>
  )
}
