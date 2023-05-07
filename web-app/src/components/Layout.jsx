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
      <main>{children}</main>
    </>
  )
}
