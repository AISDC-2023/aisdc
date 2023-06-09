import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import 'bootstrap/dist/css/bootstrap.min.css'
import Usertable from './usertable'
import Prizetable from './prizetable'
import { Button } from './../../components/Button'
import { Container } from 'react-bootstrap'
import { getUid } from '@/helpers'
import { functions } from '@/firebase.js'
import { httpsCallable } from 'firebase/functions'

export default function Admin() {
  const router = useRouter()
  const userVerify = httpsCallable(functions, 'user-verify')

  useEffect(() => {
    getUid().then((cid) => {
      userVerify({ cid: cid }).then((result) => {
        const type = result.data?.type
        if (type !== 'admin') {
          // Redirect to participant page if not admin
          router.push('/participant')
        }
      })
    })
  }, [router, userVerify])

  return (
    <>
      <Container>
        <Button
          style={{ textDecoration: 'none' }}
          onClick={() => {
            router.push('/participant')
          }}
        >
          {' '}
          Go to Participant page{' '}
        </Button>
        <Button className="ml-4" href="admin/luckydraw">
          Lucky Draw
        </Button>
        <Usertable />
        <Prizetable />
      </Container>
    </>
  )
}
