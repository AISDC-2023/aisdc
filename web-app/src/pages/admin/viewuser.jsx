import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import ListGroup from 'react-bootstrap/ListGroup'
import Badge from 'react-bootstrap/Badge'
import { Button } from '@/components/Button'
import 'bootstrap/dist/css/bootstrap.min.css'
import Container from 'react-bootstrap/Container'
import { functions } from '@/firebase.js'
import { httpsCallable } from 'firebase/functions'

export default function ViewUserPage() {
  const [userData, setUserData] = useState([])
  const [cid, setCid] = useState('')
  const [loading, setLoading] = useState(true) // add loading state
  const router = useRouter()

  useEffect(() => {
    const id = router.query.cid
    setCid(id)
    console.log(id)
    retrieveInfo(id)
  }, [])

  function retrieveInfo(id) {
    const func = httpsCallable(functions, 'user-getInfo')
    func({ cid: id })
      .then((r) => {
        console.log(r.data)
        setUserData(r.data)
        setLoading(false) // set loading state to false after data is retrieved
      })
      .catch((err) => {
        console.error(err)
        setLoading(false) // set loading state to false in case of error
      })
  }

  return (
    <>
      <Container>
        <Button href="/admin" style={{ textDecoration: 'none' }}>
          {' '}
          Back{' '}
        </Button>
        {loading ? ( // show spinner when loading is true
          <div className="mt-4 text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="mt-10">
            <h1 className="mt-4 text-center">
              {userData.type} : {userData.name}{' '}
            </h1>
            <ListGroup>
              <ListGroup.Item>
                <b> Stamps : </b>
                {userData.stampCount}
              </ListGroup.Item>
              <ListGroup.Item>
                <b> No. of unredeemed prizes: </b>
                {userData.prizeUnredeemed}{' '}
              </ListGroup.Item>
              <ListGroup.Item>
                {' '}
                <b> Prizes: </b>
                {userData.prizes && userData.prizes.length > 0
                  ? userData.prizes.map((prize) => {
                      return (
                        <div key={prize.id}>
                          {prize.name} ({prize.count})
                        </div>
                      )
                    })
                  : 'None'}
              </ListGroup.Item>
              <ListGroup.Item>
                {' '}
                <b> Transactions: </b>
                {userData.transactions && userData.prizes.length > 0
                  ? userData.prizes.map((transaction) => {
                      return (
                        <div key={transaction.id}>
                          {transaction.name} ({transaction.count})
                        </div>
                      )
                    })
                  : 'None'}
              </ListGroup.Item>
            </ListGroup>
          </div>
        )}
        <p className="text-center font-mono text-xs text-blue-400">{cid}</p>
      </Container>
    </>
  )
}
