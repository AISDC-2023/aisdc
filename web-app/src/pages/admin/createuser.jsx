import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { functions } from '@/firebase.js';
import { httpsCallable } from 'firebase/functions';
import { Button as Bootbutton } from 'react-bootstrap';
import { Button } from '@/components/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

function CreateUser() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event) {
    event.preventDefault(); // Prevent the form from submitting normally
    const form = event.target;
    const name = form.elements.name.value;
    const email = form.elements.email.value;
    const type = form.elements.type.value;
    let cid;
    if (!name || !email) {
      alert('Please fill in all fields');
      return;
    }
    if (form.elements.cid.value) {
      cid = form.elements.cid.value;
    }

    setIsSubmitting(true);

    const func = httpsCallable(functions, 'user-create');
    console.log(name, email, type);
    func({ name: name, email: email, type: type }).then(() => {
      alert('User created successfully!');
      form.reset(); // Reset the form after submission
      setIsSubmitting(false);
    }).catch((error) => {
      alert('Error creating user: ' + error.message);
      setIsSubmitting(false);
    });
  }

  return (
    <Container>
      <Button href="/admin" style={{ textDecoration: 'none' }}> Back </Button>
      <h1 className="mt-4 text-center">Create User</h1>
      <Form onSubmit={handleSubmit}>
        <FloatingLabel
          controlId='name'
          label="Name"
          className="mb-3"
        >
          <Form.Control type="text" placeholder="Enter name" disabled={isSubmitting} />
        </FloatingLabel>
        <FloatingLabel
          controlId='email'
          label="Email address"
          className="mb-3"
        >
          <Form.Control type="email" placeholder="name@example.com" disabled={isSubmitting} />
        </FloatingLabel>
        <FloatingLabel controlId='type' label="Type" className='mt-3 mb-4'>
          <Form.Select aria-label="Type" disabled={isSubmitting}>
            <option value="particpant">Participant</option>
            <option value="admin">Admin</option>
            <option value="partner">Partner</option>
          </Form.Select>
        </FloatingLabel>
        <FloatingLabel
          controlId='cid'
          label="Conference ID (optional)"
          className="mb-3"
        >
          <Form.Control type="text" placeholder="name@example.com" disabled={isSubmitting} />
        </FloatingLabel>
        <div className='flex justify-center'>
          <Bootbutton variant="primary" className='mr-3' type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Bootbutton>
          <Bootbutton variant="danger" type="reset" disabled={isSubmitting}>
            Reset
          </Bootbutton>
        </div>
      </Form>
    </Container>
  );
}

export default CreateUser;
