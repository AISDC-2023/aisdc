import { ContainerMobile } from '@/components/ContainerMobile'
import { Heading } from '@/components/Heading'
import { Paragraph } from '@/components/Paragraph'

export default function EmailSent() {
  return (
    <>
      <ContainerMobile>
        <Heading headerType="h2" className="mt-6">
          EMAIL SENT
        </Heading>

        <div className="mt-8">
          <Paragraph className="font-semibold">
            Please check your email inbox for the link.
          </Paragraph>
          <Paragraph className="font-semibold">
            If you do not receive the email, please check your spam folder.
          </Paragraph>
        </div>
      </ContainerMobile>
    </>
  )
}
