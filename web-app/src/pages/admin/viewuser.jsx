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
import Table from 'react-bootstrap/Table'
import { Button as Bootbutton } from 'react-bootstrap'

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

  const redeemPrize = (cid, pid, pname) => {
    if (window.confirm(`Are you sure you want to redeem ${pname}?`)) {
      const func = httpsCallable(functions, 'prize-redeem')
      func({ cid: cid, pid: pid })
        .then((r) => {
          console.log(r)
          retrieveInfo(cid)
        })
        .catch((err) => {
          console.error(err)
        })
    }
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
                {userData.prizes && userData.prizes.length > 0 ? (
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Prize Name</th>
                        <th>Prize ID</th>
                        <th>Redeem</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userData.prizes.map((prize, index) => (
                        <tr key={index}>
                          <td>{prize.name}</td>
                          <td>{prize.pid}</td>
                          <td>
                            {!prize.redeemed ? (
                              <Bootbutton
                                variant="success"
                                size="sm"
                                onClick={() =>
                                  redeemPrize(cid, prize.pid, prize.name)
                                }
                              >
                                Redeem
                              </Bootbutton>
                            ) : (
                              <Badge bg="secondary">Redeemed</Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  'None'
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                {' '}
                <b> Activity: </b>
                {userData.transactions && userData.transactions.length > 0 ? (
                  <Table striped bordered hover responsive size="sm">
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th>Type</th>
                        <th>Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userData.transactions
                        .sort(
                          (a, b) => b.timestamp._seconds - a.timestamp._seconds
                        )
                        .map((transaction) => (
                          <tr key={transaction.id}>
                            <td>{transaction.description}</td>
                            <td>{transaction.type}</td>
                            <td>
                              {new Date(
                                transaction.timestamp._seconds * 1000
                              ).toLocaleString('en-GB', {
                                day: '2-digit',
                                month: '2-digit',
                                year: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: true,
                              })}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                ) : (
                  'None'
                )}
              </ListGroup.Item>
            </ListGroup>
          </div>
        )}
        <p className="text-center font-mono text-xs text-blue-400">{cid}</p>
      </Container>
    </>
  )
}
