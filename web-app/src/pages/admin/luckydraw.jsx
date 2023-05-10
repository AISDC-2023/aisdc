import React, { useState, useEffect } from 'react'
import { Container } from 'react-bootstrap'
import { Button } from './../../components/Button'
import 'bootstrap/dist/css/bootstrap.min.css'
import shuffle from 'lodash/shuffle';
import { functions } from '@/firebase.js'
import { httpsCallable } from 'firebase/functions'

const userlistfunc = httpsCallable(functions, 'user-list')

const Luckydraw = () => {
  const [names, setNames] = useState([])
  const [initialLoad, setInitialLoad] = useState(false);

  useEffect(() => {
    userlistfunc({})
      .then((res) => {
        const participants = res.data.users.filter(user => user.type === 'participant')
        setNames(participants)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  useEffect(() => {
    if (initialLoad) {
      const filteringTimer = setTimeout(() => {
        startRaffle();
      }, 700);
      return () => {
        clearTimeout(filteringTimer);
      };
    }
  }, [initialLoad, names, startRaffle]);

  function startRaffle() {
    if(names.length <= 1) {
      return;
    }
    const randomIndex = Math.floor(Math.random() * names.length);
    const filterOutNames = names.filter((name) => name !== names[randomIndex]);
    setNames(filterOutNames);
    setInitialLoad(true);
  }
    return (
      <>
        <Container>
          <Button href="/admin" style={{ textDecoration: 'none' }}>
            {' '}Back{' '}
          </Button>
          <h1>Lucky Draw</h1>
          <Button onClick={startRaffle}> Start Lucky Draw </Button>
          <Button onClick={() => setNames(shuffle(names))}> Shuffle </Button>
          {names.map((names, index) =>  (
            <div key={index}>
              <ul>
                <li>{names.name}</li>
              </ul>
            </div>
          ))}
        </Container>
      </>
    );
  };

export default Luckydraw