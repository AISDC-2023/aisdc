import { useState } from 'react'
import { useRouter } from 'next/router'
import { functions } from '@/firebase.js'
import { httpsCallable } from 'firebase/functions'
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
    // detect whether the result is a valid CID
    // assume always true for now
    const isValidCid = true

    if (isValidCid) {
      // send to server and redirect
      const func = httpsCallable(functions, 'user-create')
      func({ name: name, email: email, type: 'participant' })
        .then((result) => {
          // Read result of the Cloud Function.
          /** @type {any} */
          const data = result.data
          // const sanitizedMessage = data.text;
          console.log(result)
          setAuthRes('s')
        })
        .catch((error) => {
          // Getting the Error details.
          console.log(error)
          setAuthRes('f')
        })
    } else {
      setAuthRes('f')
    }
  }

  return (
    <>
      <ContainerMobile>
        <Heading headerType="h2" className="mt-6">
          REGISTER
        </Heading>

        <div className="mt-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-medium leading-6 text-blue-900">
                Conference ID
              </label>
              <div className="mt-2">{cid}</div>
            </div>
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
                Conference ID is not valid. Please try another.
              </Paragraph>
            </div>
          </form>
        </div>
      </ContainerMobile>
    </>
  )
}
