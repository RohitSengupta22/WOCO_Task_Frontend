import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { BaseUrl } from './Baseurl';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditModal({ show, handleClose, user }) {
    const [usercred, setUserCred] = useState({
        FirstName: '',
        LastName: ''
    });

    useEffect(() => {
        if (user) {
            setUserCred({
                FirstName: user.FirstName,
                LastName: user.LastName
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setUserCred({ ...usercred, [e.target.name]: e.target.value });
    };

    const saveChanges = async () => {
        try {
            const response = await axios.patch(`${BaseUrl}/edit/${user._id}`, {
                FirstName: usercred.FirstName,
                LastName: usercred.LastName
            });
            console.log(response.data);
            handleClose();
            editSuccess()
        } catch (error) {
            console.error(error);
        }
    };

    const editSuccess = () => toast("Refresh The Page To View Changes!!");

    return (
        <>
            <Modal show={show} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FloatingLabel controlId="floatingTextarea" label="FirstName" className="mb-3">
                        <Form.Control as="textarea" placeholder="FirstName" name="FirstName" value={usercred.FirstName} onChange={handleChange} />
                    </FloatingLabel>
                    <FloatingLabel controlId="floatingTextarea" label="LastName" className="mb-3">
                        <Form.Control as="textarea" placeholder="LastName" name="LastName" value={usercred.LastName} onChange={handleChange} />
                    </FloatingLabel>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={saveChanges}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"

            />
        </>
    );
}

export default EditModal;
