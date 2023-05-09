import React, { useState, useEffect } from 'react'
import Table from 'react-bootstrap/Table'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Badge from 'react-bootstrap/Badge'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import 'bootstrap/dist/css/bootstrap.min.css'
import Link from 'next/link'
import { functions } from '@/firebase.js'
import { httpsCallable } from 'firebase/functions'
import { Button } from 'react-bootstrap'
import { useRouter } from 'next/router'

const userlistfunc = httpsCallable(functions, 'user-list')
const deleteuserfunc = httpsCallable(functions, 'user-deleteUser')

const Usertable = () => {
  const [userData, setUserData] = useState([])
  const [search, setSearch] = useState('')
  let [authRes, setAuthRes] = useState('')
  const router = useRouter()

  useEffect(() => {
    userlistfunc({})
      .then((res) => {
        console.log(res.data.users)
        setUserData(res.data.users)
        //console.log(userData)
        setAuthRes('s')
      })
      .catch((error) => {
        console.log(error)
        setAuthRes('f')
      })
  }, [])

  const deleteUser = (cid, name) => {
    if (window.confirm(`Are you sure you want to delete user: ${name}?`)) {
      deleteuserfunc({ cid: cid })
        .then((res) => {
          const newUserData = userData.filter((user) => user.cid !== cid)
          setUserData(newUserData)
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
  const adminCount = userData.reduce((count, user) => {
    if (user.type === 'admin') {
      count++
    }
    return count
  }, 0)

  const partnerCount = userData.reduce((count, user) => {
    if (user.type === 'partner') {
      count++
    }
    return count
  }, 0)

  const participantCount = userData.reduce((count, user) => {
    if (user.type === 'particpant') {
      count++
    }
    return count
  }, 0)

  return (
    <Container>
      <h1 className="mt-4 text-center"> User Data </h1>
      <Button variant="success" href={`admin/createuser`}>
        Add User
      </Button>
      <Form>
        <InputGroup className="my-3">
          {/* onChange for search */}
          <Form.Control
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Name or CID"
          />
        </InputGroup>
      </Form>
      <div className="mb-3">
        <OverlayTrigger
          key="top1"
          placement="top"
          overlay={<Tooltip id={`tooltip-top`}>Admins</Tooltip>}
        >
          <Badge bg="primary" className="me-2">
            {adminCount}
          </Badge>
        </OverlayTrigger>
        +{' '}
        <OverlayTrigger
          key="top2"
          placement="top"
          overlay={<Tooltip id={`tooltip-top`}>Partners</Tooltip>}
        >
          <Badge bg="warning" className="me-2 text-black">
            {partnerCount}
          </Badge>
        </OverlayTrigger>
        +{' '}
        <OverlayTrigger
          key="top3"
          placement="top"
          overlay={<Tooltip id={`tooltip-top`}>Participants</Tooltip>}
        >
          <Badge bg="danger" className="me-2">
            {participantCount}
          </Badge>
        </OverlayTrigger>
        ={'  '}
        <Badge bg="success" className="w-50%">
          {adminCount + partnerCount + participantCount}
        </Badge>
      </div>
      <Table striped bordered hover responsive size="sm">
        <thead>
          <tr>
            <th>Name</th>
            <th>CID</th>
            <th>Type</th>
            <th>Email</th>
            <th>Delete User</th>
          </tr>
        </thead>
        <tbody>
          {userData
            .filter((item) => {
              return search.toLowerCase() === ''
                ? item
                : item.name.toLowerCase().includes(search.toLowerCase()) ||
                    item.cid.toLowerCase().includes(search.toLowerCase())
            })
            .map((item, index) => (
              <tr key={index}>
                <td>
                  <Link
                    href={`admin/viewuser?cid=${item.cid}`}
                    style={{ color: 'blue', textDecoration: 'none' }}
                  >
                    {item.name}
                  </Link>
                </td>
                <td>{item.cid}</td>
                <td>{item.type}</td>
                <td>{item.email}</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteUser(item.cid, item.name)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            )).slice(0, 50)  // Show only first 50 result to avoid cluttering
            }
        </tbody>
      </Table>
    </Container>
  )
}

export default Usertable
