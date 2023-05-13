import React, { useState, useEffect } from 'react'
import { ContainerMobile } from '@/components/ContainerMobile'
import { Paragraph } from '@/components/Paragraph'
import { Heading } from '@/components/Heading'

export default function Home() {
  return (
    <>
      <ContainerMobile>
        <Heading headerType="h2" className="mt-6">
          THANK YOU
        </Heading>
        <div className="mt-8">
          <Paragraph className="font-semibold">
           We see you next year!
          </Paragraph>
        </div>
      </ContainerMobile>
    </>
  )
}
