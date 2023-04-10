import { useState } from 'react'
import { useRouter } from 'next/router'
import { ContainerMobile } from '@/components/ContainerMobile'
import { Button } from '@/components/Button'
import { Heading } from '@/components/Heading'
import { Input } from '@/components/Input'
import { Paragraph } from '@/components/Paragraph'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { CameraIcon, CommandLineIcon } from '@heroicons/react/24/solid'

export default function Login() {
  let [cid, setCid] = useState('')
  let [authRes, setAuthRes] = useState('')
  const router = useRouter()

  const handleCidChange = (newValue) => {
    setCid(newValue)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    // detect whether the result is a valid CID
    const regex = /^cid/

    if (regex.test(cid)) {
      // send to server and redirect
      await fetch('https://random-data-api.com/api/v2/users?size=1')
        .then((res) => {
          setAuthRes('s')
          const profile = res.json()
          switch (profile.id) {
            case 'admin':
              router.push('/admin?cid=' + cid)
              break
            case 'partner':
              router.push('/partner?cid=' + cid)
              break
            default:
              router.push('/participant?cid=' + cid)
          }
        })
        .catch(() => {
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
          SIGN IN
        </Heading>
        <p className="mt-2 inline-flex text-blue-600">
          <InformationCircleIcon className="mr-3 h-6 w-6" />

          <span>Find Conference ID at back of the pass</span>
        </p>

        <div className="mt-8">
          <p className="font-medium leading-6 text-blue-900">Sign in with QR</p>
          <div className="mt-2">
            <Button
              href="/login/scan"
              className="w-full items-center"
              type="button"
            >
              <span>Camera</span>
              <span className="sr-only">Sign in with QR</span>
              <CameraIcon className="ml-3 h-6 w-6" />
            </Button>
          </div>

          <div className="relative mt-6">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-blue-300" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-2 text-blue-500">
                Or continue with
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              id="cid"
              label="Conference ID"
              type="text"
              required={true}
              value={cid}
              onChange={handleCidChange}
            />
            <div>
              <Button className="w-full" type="submit">
                Enter AI Playground
                <CommandLineIcon className="ml-3 h-6 w-6" />
              </Button>
              <Paragraph
                className={authRes === 's' ? 'mt-1 text-green-600' : 'hidden'}
              >
                Authenticated! Redirecting...
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
