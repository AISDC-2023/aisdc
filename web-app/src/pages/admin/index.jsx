import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Usertable from './usertable'
import Prizetable from './prizetable'
import {Button} from './../../components/Button'
import { Container } from 'react-bootstrap'

const admin = () => {
  return (
    <>
      <Container>
      <Button href='/participant' style={{ textDecoration: 'none' }}> Participant's page </Button>
      <Usertable />
      <Prizetable />
      </Container>
    </>
  )
}

export default admin
