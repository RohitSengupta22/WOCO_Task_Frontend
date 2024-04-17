import React, { useEffect, useState } from 'react';
import NavComp from './NavComp';
import { BaseUrl } from './Baseurl';
import Table from 'react-bootstrap/Table';
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDeleteForever } from "react-icons/md";
import { FaCrown } from "react-icons/fa";
import axios from 'axios';
import EditModal from './EditModal';
import DeleteModal from './DeleteModal';
import AddModal from './AddModal'; 
import { IoIosAddCircle } from "react-icons/io";

const Homepage = () => {
    const [users, setUsers] = useState([]);
    const [loggedUser, setLoggedUser] = useState();
    const authToken = localStorage.getItem('token');
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false); 
    const handleCloseEditModal = () => setShowEditModal(false);
    const handleShowEditModal = () => setShowEditModal(true);
    const handleCloseDeleteModal = () => setShowDeleteModal(false);
    const handleShowDeleteModal = (user) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    }

    const handleCloseAddModal = () => setShowAddModal(false); 
    const handleShowAddModal = () => setShowAddModal(true); 

    useEffect(() => {
        async function fetchAllUsers() {
            try {
                const response = await axios.get(`${BaseUrl}/allusers`);
                setUsers(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchAllUsers();
    }, []);

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await axios.get(`${BaseUrl}/user`, {
                    headers: {
                        'auth-token': authToken
                    }
                });
                console.log(response.data)
                setLoggedUser(response.data)
            } catch (error) {
                console.error(error);
            }
        }
        fetchUser();
    }, []);

    function editHandler(user) {
        setSelectedUser(user);
        handleShowEditModal();
    }

    const deleteHandler = async (user) => {
        try {
            const response = await axios.delete(`${BaseUrl}/delete/${user._id}`);
            console.log(response.data);
            handleCloseDeleteModal();

            const refreshedUsers = users.filter(u => u._id !== user._id);
            setUsers(refreshedUsers);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <NavComp />
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Email</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Role</th>
                        {
                            loggedUser && loggedUser.loggedInUser.Role === 'Admin' ?
                                (
                                    <th>Actions</th>
                                ) : null
                        }
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user._id}>
                            <td>{index + 1}</td>
                            <td>{user.Email} {user.Role === 'Admin' ? <span><FaCrown style={{ color: '#b8b449' }} /></span> : null}
                                {loggedUser && user.Email === loggedUser.loggedInUser.Email ? <span style={{ fontWeight: 'bold', marginLeft: '5px' }}>(You)</span> : null}
                            </td>
                            <td>{user.FirstName}</td>
                            <td>{user.LastName}</td>
                            <td>{user.Role}</td>
                            {
                                loggedUser && loggedUser.loggedInUser.Role === 'Admin' ?
                                    (
                                        <td>
                                            <FaRegEdit style={{ color: 'blue', cursor: 'pointer' }} onClick={() => editHandler(user)} />
                                            {
                                                user.Role === 'Viewer' ? (<MdOutlineDeleteForever style={{ color: 'red', cursor: 'pointer', marginLeft: '10px' }} onClick={() => handleShowDeleteModal(user)} />) : null
                                            }

                                        </td>
                                    ) : null
                            }
                        </tr>
                    ))}
                </tbody>
            </Table>
            <EditModal show={showEditModal} handleClose={handleCloseEditModal} user={selectedUser} />
            <DeleteModal show={showDeleteModal} handleClose={handleCloseDeleteModal} handleDelete={() => deleteHandler(selectedUser)} />
            <AddModal show={showAddModal} handleClose={handleCloseAddModal} /> 
            {
                loggedUser && loggedUser.loggedInUser.Role === 'Admin' ? (
                    <IoIosAddCircle
                        size={60}
                        style={{
                            position: 'fixed',
                            bottom: '20px',
                            right: '20px',
                            cursor: 'pointer',
                            zIndex: '1000', 
                            '@media (max-width: 768px)': { 
                                bottom: '10px',
                                right: '10px',
                            }
                        }}
                        onClick={handleShowAddModal} 
                    />
                ) : null
            }


        </div>
    );
};

export default Homepage;
