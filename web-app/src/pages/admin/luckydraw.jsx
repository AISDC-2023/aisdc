import React from 'react'
import { Container } from 'react-bootstrap'
import { Button } from './../../components/Button'

const luckydraw = (userData) => {
  return (
    <Container>
        <Button href="/admin" style={{ textDecoration: 'none' }}>
        {' '}
        Back{' '}
      </Button>
      Lucky Draw
    </Container>
  )
}

export default luckydraw