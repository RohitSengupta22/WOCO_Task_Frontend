import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { BaseUrl } from './Baseurl';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const AddModal = ({ show, handleClose }) => {
    const [user, setUser] = useState({
        FirstName: '',
        LastName: '',
        Email: ''
    });

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${BaseUrl}/add`, user);
            console.log(response.data);
            handleClose();
            addSuccess()
        } catch (error) {
            console.error(error);
        }
    };

    const addSuccess = () => toast("Refresh The Page To View Added User!!");

    return (
        <Modal show={show} onHide={handleClose} animation={false}>
            <Modal.Header closeButton>
                <Modal.Title>Add User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicFirstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter first name" name="FirstName" value={user.FirstName} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicLastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter last name" name="LastName" value={user.LastName} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" name="Email" value={user.Email} onChange={handleChange} />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Add
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddModal;
