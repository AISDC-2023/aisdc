import Head from 'next/head'
import { Header } from '@/components/Header'
import Image from 'next/image'
import orangeVector from '@/images/orange-vector.png'
import blueVector from '@/images/blue-vector.png'

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>AI Student Developer Conference - AI Singapore</title>
        <meta
          name="description"
          content="Students get exposed to current AI/ML engineering practices and tools, promote AI/ML careers, and establish a bridge between local AI talents and industry partners."
        />
      </Head>
      <Header />
      <Image
        className="fixed -bottom-2 -left-5 z-[1] w-32"
        src={orangeVector}
        alt=""
        priority
        optimized="false"
      />
      <Image
        className="fixed -left-16 bottom-20 z-[-1] w-44 rotate-[34deg]"
        src={blueVector}
        alt=""
        priority
        optimized="false"
      />
      <main>{children}</main>
    </>
  )
}
