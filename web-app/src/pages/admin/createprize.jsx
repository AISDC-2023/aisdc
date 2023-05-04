import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { functions } from '@/firebase.js';
import { httpsCallable } from 'firebase/functions';
import { Button as Bootbutton } from 'react-bootstrap';
import { Button } from '@/components/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

function CreatePrize () {
    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleSubmit(event) {
        event.preventDefault(); // Prevent the form from submitting normally
        const form = event.target;
        const name = form.elements.name.value;
        const quantity = form.elements.quantity.value;
        const isRare = form.elements.isRare.value;
        if (!name || !quantity) {
            alert('Please fill in all fields');
            return;
        }

        setIsSubmitting(true);

        const func = httpsCallable(functions, 'prize-create');
        console.log(name, quantity, isRare);
        func({ name: name, quantity: quantity, isRare: isRare }).then(() => {
            alert('Prize created successfully!');
            form.reset(); // Reset the form after submission
            setIsSubmitting(false);
        }).catch((error) => {
            alert('Error creating prize: ' + error.message);
            setIsSubmitting(false);
        });
    }
    return (
        <Container>
            <Button href="/admin" style={{ textDecoration: 'none' }}> Back </Button>
            <h1 className="mt-4 text-center">Create Prize</h1>
            <Form onSubmit={handleSubmit}>
                <FloatingLabel
                    controlId='name'
                    label="Name"
                    className="mb-3"
                >
                    <Form.Control type="text" placeholder="Enter name" disabled={isSubmitting} />
                </FloatingLabel>
                <FloatingLabel
                    controlId='quantity'
                    label="Quantity"
                    className="mb-3"
                >
                    <Form.Control type="number" placeholder="Enter quantity" disabled={isSubmitting} />
                </FloatingLabel>
                <FloatingLabel controlId='isRare' label="Is it rare?" className='mt-3 mb-4'>
                    <Form.Select aria-label="Type" disabled={isSubmitting}>
                        <option value={false}>No</option>
                        <option value={true}>Yes</option>
                    </Form.Select>
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
    )
}

export default CreatePrize