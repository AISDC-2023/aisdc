import { useState } from 'react'
import { useRouter } from 'next/router'
import { functions } from '@/firebase.js'
import { httpsCallable } from 'firebase/functions'
import { sendEmail } from '@/helpers'
import { ContainerMobile } from '@/components/ContainerMobile'
import { Button } from '@/components/Button'
import { Heading } from '@/components/Heading'
import { Input } from '@/components/Input'
import { Paragraph } from '@/components/Paragraph'
import { CommandLineIcon } from '@heroicons/react/24/solid'

export default function Register() {
  const router = useRouter()
  const { cid } = router.query
  let [name, setName] = useState('')
  let [email, setEmail] = useState('')

  let [authRes, setAuthRes] = useState('')

  const handleNameChange = (newValue) => {
    setName(newValue)
  }

  const handleEmailChange = (newValue) => {
    setEmail(newValue)
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const func = httpsCallable(functions, 'user-create')
    func({ name: name, email: email, cid: cid, type: 'participant' })
      .then((result) => {
        const data = result.data
        const sanitizedMessage = data.text

        // if success redirect to email link else show error
        if (true) {
          setAuthRes('s')
          const path = '/participant?cid=1234'
          sendEmail(id, email)
        } else {
          // already exists or invalid
          setAuthRes('f')
        }
      })
      .catch((error) => {
        setAuthRes('f')
      })
  }

  return (
    <>
      <ContainerMobile>
        <Heading headerType="h2" className="mt-6">
          REGISTER
        </Heading>

        <div className="mt-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              id="name"
              label="Name"
              type="text"
              required={true}
              value={name}
              onChange={handleNameChange}
            />
            <Input
              id="email"
              label="Email"
              type="email"
              required={true}
              value={email}
              onChange={handleEmailChange}
            />
            <div>
              <Button className="w-full" type="submit">
                Create Account
                <CommandLineIcon className="ml-3 h-6 w-6" />
              </Button>
              <Paragraph
                className={authRes === 's' ? 'mt-1 text-green-600' : 'hidden'}
              >
                Registered! Check your email for the link.
              </Paragraph>
              <Paragraph
                className={authRes === 'f' ? 'mt-1 text-red-600' : 'hidden'}
              >
                Conference ID is not valid. Please try again.
              </Paragraph>
            </div>
          </form>
        </div>
      </ContainerMobile>
    </>
  )
}