import { useState } from 'react'
import { useRouter } from 'next/router'
import { ContainerMobile } from '@/components/ContainerMobile'
import { Button } from '@/components/Button'
import { Heading } from '@/components/Heading'
import { Input } from '@/components/Input'
import { Paragraph } from '@/components/Paragraph'

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
              router.push('/admin')
              break
            case 'partner':
              router.push('/partner')
              break
            default:
              router.push('/participant')
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="mr-3 h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
            />
          </svg>
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
              <svg
                className="ml-3 h-6 w-6"
                aria-hidden="true"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                />
              </svg>
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
