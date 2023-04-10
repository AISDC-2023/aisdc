import { Paragraph } from '@/components/Paragraph'
import { Heading } from '@/components/Heading'
import { Button } from '@/components/Button'
import { Container } from '@/components/index/Container'

export function Hero() {
  return (
    <div className="relative pb-20 pt-10">
      <Container className="relative">
        <div className="mx-auto max-w-2xl lg:max-w-4xl lg:px-12">
          <Heading headerType="h1">
            <span className="sr-only">DeceptiConf - </span>A design conference
            for the dark side.
          </Heading>
          <div className="mt-6 space-y-6">
            <Paragraph className="text-2xl text-orange-600">
              The next generation of web users are tech-savvy and suspicious.
              They know how to use dev tools, they can detect a phishing scam
              from a mile away, and they certainly aren’t accepting any checks
              from Western Union.
            </Paragraph>
          </div>
          <Button href="/login" className="mt-10 w-full">
            Enter
          </Button>
          <dl className="mt-10 grid grid-cols-2 gap-x-10 gap-y-6 sm:mt-16 sm:gap-x-16 sm:gap-y-10 sm:text-center lg:auto-cols-auto lg:grid-flow-col lg:grid-cols-none lg:justify-start lg:text-left">
            {[
              ['Speakers', '18'],
              ['People Attending', '2,091'],
              ['Venue', 'Staples Center'],
              ['Location', 'Los Angeles'],
            ].map(([name, value]) => (
              <div key={name}>
                <dt className="font-mono text-blue-600">{name}</dt>
                <dd className="mt-0.5 text-2xl font-semibold tracking-tight text-blue-900">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </div>
  )
}
