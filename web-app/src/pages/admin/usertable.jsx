import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import 'bootstrap/dist/css/bootstrap.min.css';

import { functions } from '@/firebase.js'
import { httpsCallable } from 'firebase/functions'

const userlistfunc = httpsCallable(functions, 'user-list')

const Usertable = () => {
  const [userData, setUserData] = useState([]);
  const [search, setSearch] = useState('');
  let [authRes, setAuthRes] = useState('');

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
  }, []);

  return (
    <div>
      <Container>
        <h1 className='text-center mt-4'>User Data</h1>
        <Form>
          <InputGroup className='my-3'>

            {/* onChange for search */}
            <Form.Control
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Search Name'
            />
          </InputGroup>
        </Form>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Type</th>
              <th>Conference ID</th>
            </tr>
          </thead>
          <tbody>
            {
            userData
              .filter((item) => {
                return search.toLowerCase() === ''
                  ? item
                  : item.name.toLowerCase().includes(search);
              })
              .map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.type}</td>
                  <td>{item.cid}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Container>
    </div>
  );
}

export default Usertable