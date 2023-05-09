import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Usertable from './usertable'
import Prizetable from './prizetable'
import { Button } from './../../components/Button'
import { Container } from 'react-bootstrap'

const admin = () => {
  return (
    <>
      <Container>
        <Button href="/participant" style={{ textDecoration: 'none' }}>
          {' '}
          Go to Participant page{' '}
        </Button>
        <Button href="/admin/luckydraw" style={{ textDecoration: 'none' }} className='ml-4'>
          {' '}
          Lucky Draw{' '}
        </Button>
        <Usertable />
        <Prizetable />
      </Container>
    </>
  )
}

export default admin
