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
  let [errorMsg, setErrorMsg] = useState('Error Occured. Try Again.')
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
        // if success redirect to email link else show error
        setAuthRes('s')
        const params = `cid=${cid}`
        sendEmail(params, email)
          .then(() => {
            // The link was successfully sent. Inform the user.
            window.localStorage.setItem('emailForSignIn', email)
            router.push('/email-sent')
          })
          .catch((error) => {
            console.log(error)
            setAuthRes('f')
            setErrorMsg('Error Occured While Sending Email. Try Again.')
          })
      })
      .catch((error) => {
        console.log(error.code)
        switch (error.code) {
          case 'functions/invalid-argument':
            setAuthRes('f')
            setErrorMsg('Invalid Email Address or Conference ID.')
            break
          case 'functions/already-exists':
            setAuthRes('f')
            setErrorMsg(
              'Email Address or Conference ID already registered. Try Login instead.'
            )
            break
          case 'functions/permission-denied':
            setAuthRes('f')
            setErrorMsg('Insufficient Permission')
            break
        }
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
              disabled={authRes === 's'} // disable if register success
              onChange={handleNameChange}
            />
            <Input
              id="email"
              label="Email"
              type="email"
              required={true}
              value={email}
              onChange={handleEmailChange}
              disabled={authRes === 's'} // disable if register success
            />
            <div>
              <Button
                className="w-full"
                type="submit"
                disabled={authRes === 's'}
              >
                Create Account
                <CommandLineIcon className="ml-3 h-6 w-6" />
              </Button>
              <Paragraph
                className={authRes === 's' ? 'mt-1 text-green-600' : 'hidden'}
              >
                Registered! Sending mail...
              </Paragraph>
              <Paragraph
                className={authRes === 'f' ? 'mt-1 text-red-600' : 'hidden'}
              >
                {errorMsg}
              </Paragraph>
            </div>
          </form>
        </div>
      </ContainerMobile>
    </>
  )
}
