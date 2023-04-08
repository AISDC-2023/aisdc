import { HeadMeta } from '@/components/HeadMeta'
import { Header } from '@/components/Header'

export default function Profile({ profile }) {
  return (
    <>
      <HeadMeta />
      <Header />
      <main>

      </main>
    </>
  )
}

export async function getStaticProps() {
  // Call an external API endpoint to get posts
  const res = await fetch('https://.../posts')
  const profile = await res.json()

  return {
    props: {
      profile,
    },
  }
}