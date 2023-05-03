import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Table from 'react-bootstrap/Table'
import { Heading } from '@/components/Heading'
import { Button } from '@/components/Button'
import 'bootstrap/dist/css/bootstrap.min.css'
import Container from 'react-bootstrap/Container'
import { functions } from '@/firebase.js'
import { httpsCallable } from 'firebase/functions'

const userinfofunc = httpsCallable(functions, 'user-getInfo')

export default function ViewUserPage() {
  const [userData, setUserData] = useState([])

  const router = useRouter()
  const { cid } = router.query
  console.log('CID val from url: ' + cid)

  let [authRes, setAuthRes] = useState('')

  useEffect(() => {
    console.log('cid1: ', cid)
    if (cid) {
      userinfofunc({ cid: cid })
        .then((res) => {
          console.log('cid2: ', cid)
          console.log(res.data)
          setUserData(res.data)
          setAuthRes('s')
        })
        .catch((error) => {
          console.log(error)
          setAuthRes('f')
        })
    }
  }, [cid])

  return (
    <>
      <Container>
        <Button href="/admin"> Back </Button> <br />
        <h1 className="mt-4 text-center">Viewing User {cid}</h1>
      </Container>
    </>
  )
}
