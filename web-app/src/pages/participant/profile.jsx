export default function Profile({ profile }) {
  return <>{profile.id}</>
}

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
