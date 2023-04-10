import { Paragraph } from '@/components/Paragraph'
import Link from 'next/link'

export function Logo(props) {
  return (
    <Link href="/">
      <Paragraph className="text-md text-center text-2xl font-bold leading-none">
        AI STUDENT DEVELOPER
        <br />
        <span className="text-orange-600">CONFERENCE</span>
      </Paragraph>
    </Link>
  )
}
