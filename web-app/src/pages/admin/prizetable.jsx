import React, { useState, useEffect } from 'react'
import Table from 'react-bootstrap/Table'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import { Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

import { functions } from '@/firebase.js'
import { httpsCallable } from 'firebase/functions'

const prizelistfunc = httpsCallable(functions, 'prize-get')
const deleteprizefunc = httpsCallable(functions, 'user-deletePrize')

const Prizetable = () => {
  const [prizeData, setPrizeData] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    prizelistfunc({})
      .then((res) => {
        console.log(res.data.prizes)
        setPrizeData(res.data.prizes)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  const filteredPrizes = Object.entries(prizeData)
    .filter(([id, prize]) =>
      prize.name.toLowerCase().includes(search.toLowerCase())
    )
    .reduce((obj, [id, prize]) => ({ ...obj, [id]: prize }), {})

  //console.log('filtered prizes', filteredPrizes)
  return (
    <div>
      <Container>
        <h1 className="mt-4 text-center">Prizes</h1>
        <Button variant="success" href={`admin/createprize`}>
          Add Prize
        </Button>
        <Form>
          <InputGroup className="my-3">
            <Form.Control
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Prize Name"
            />
          </InputGroup>
        </Form>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Quantity</th>
              <th>Rarity</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(filteredPrizes).map(([id, prize]) => (
              <tr key={id}>
                <td>{prize.name}</td>
                <td>{prize.quantity}</td>
                <td>{prize.isRare ? 'Rare' : 'Normal'}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </div>
  )
}

export default Prizetable
