import { ContainerMobile } from '@/components/ContainerMobile'
import { Heading } from '@/components/Heading'
import Image from 'next/image'
import hologramGif from '@/images/hologram.gif'
import { StampsCounter } from '@/components/participant/StampsCounter'
import { Prize } from '@/components/participant/Prize'
import { Prizes } from '@/components/participant/Prizes'
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

  const prizes = [
    {
      id: 4,
      name: 'Prize 1',
      available: true
    },
    {
      id: 40,
      name: 'Prize 12',
      available: false
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
      prizes
    },
  }
}

export default function Redeem({ profile, activity, prizes }) {
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
            <Prize></Prize>
            <Prizes title="PRIZES" list={prizes}></Prizes>
            <Timeline title="REDEMPTION HISTORY" list={activity} />
            <p className="text-center font-mono text-xs text-blue-400">
              {profile.uid}
            </p>
          </div>
        </div>
      </ContainerMobile>
    </>
  )
}
