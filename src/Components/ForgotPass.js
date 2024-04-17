import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import '../CSS/ForgotPass.css'
import { useNavigate } from 'react-router-dom';
import { BaseUrl } from './Baseurl';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

const ForgotPass = () => {

    const navigate = useNavigate();

    const [resetCred, setResetCred] = useState({
        Email: ''
    });

    const [cred, setCred] = useState({
        Email: '',
        Password: ''
    });

    const [emailError, setEmailError] = useState('')
    const [PassError, setPassError] = useState('')


    const [key, setKey] = useState('');
    const [fetchedKey, setFetchedKey] = useState('');
    const [verifyKey, setVerifyKey] = useState(false);

    const [reset, setReset] = useState(false);
    const [loader, setLoader] = useState(false);

    function openLoader() {
        setLoader(true);
    }

    function closeLoader() {
        setLoader(false);
    }

   
    const enterEmail = () => toast("Email Cannot Be Empty")
    const enterKey = () => toast("Key Cannot Be Empty")
    const enterPassword = () => toast("Enter New Password")
    const wrongKey = () => toast("Incorrect Key")
    const mailSent = () => toast("Check your email for the password reset key")
    const mailFireError = () => toast("Cannot send the key now, try after sometime")
    const passchanged = () =>  toast("Password Successfully Updated!")

    function changeHandler(e) {
        const { name, value } = e.target;
        setResetCred({ ...resetCred, [name]: value });
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
            setEmailError(''); // Clear the error message if the password is empty
        } else if (name == 'Email' && !emailRegex.test(value)) {
            setEmailError('Enter A Valid Email');
        } else {
            setEmailError('');
        }
        setCred({ ...cred, [name]: value });
    }

    function changeCredHandler(e) {
        const { name, value } = e.target;
        const passRegex = /^(?=.*[A-Z])[a-zA-Z0-9]{6,}/;

        if (!value) {
            setPassError(''); // Clear the error message if the password is empty
        } else if (name=='Password' && !passRegex.test(value)) {
            setPassError('Min 6 Characters Required & Must Contain Min 1 Uppercase Character');
        } else {
            setPassError('');
        }
        setCred({ ...cred, [name]: value });
    }

    function changeKeyHandler(e) {
        setKey(e.target.value);
    }

    async function resetHandler() {

        if (resetCred.Email === '') {
            enterEmail()
        }

        else {
            try {
                const response = await fetch(`${BaseUrl}/reset`, {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(resetCred),
                });

                console.log(response.status);

                if (response.ok) {
                    const res = await response.json();
                    localStorage.setItem('token', res.token);
                    mailSent()
                    setFetchedKey(res);
                    setReset(true);
                } else {
                   mailFireError()
                }
            } catch (error) {
                console.log(error);
            } finally {
                closeLoader();
            }
        }
    }

    function verifyHandler() {

        if (key === '') {
           enterKey()
        }


        else if (fetchedKey.toString() == key.toString()) {
            setVerifyKey(true)
        } else {
           wrongKey()
        }
    }

    async function passHandler() {

        if (key === '') {
           enterPassword()
        } else {



            try {
                const response = await fetch(`${BaseUrl}/update`, {
                    method: 'PATCH',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(cred),
                });

                console.log(response.status);

                if (response.ok) {
                    const res = await response.json();
                    localStorage.setItem('token', res.token);
                    passchanged()
                    setTimeout(()=>{
                        navigate('/')
                    },2000)
                   

                } else {
                    alert('error');
                }
            } catch (error) {
                console.log(error);
            } finally {
                closeLoader();
            }

        }


    }

    return (
        <>
            {loader && (
                <div>
                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={openLoader}
                        onClick={closeLoader}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                </div>
            )}
            <div className='credbox' style={{ width: '500px', height: '200px', backgroundColor: 'white', boxShadow: '3px 3px rgba(0, 0, 0, 0.43)', borderRadius: '10px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
                {reset ? (
                    verifyKey ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <TextField
                                required
                                id="outlined-required"
                                label="New Password"

                                style={{ width: '90%', margin: '10px' }}
                                name="Password"
                                onChange={changeCredHandler}
                                value={cred.Password}
                            />
                             <p style={{ color: 'red', fontSize: '10px', textAlign: 'left' }}>{PassError}</p>
                            <Button variant="contained"  disabled={PassError !== ''} style={{ width: '90%', marginTop: '20px', backgroundColor: 'black', color: 'white', fontWeight: 'bold' }} onClick={passHandler}>Change Password </Button>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <TextField
                                required
                                id="outlined-required"
                                label="Key"
                                defaultValue="johndoe@example.com"
                                style={{ width: '90%', margin: '10px' }}
                                name="key"
                                onChange={changeKeyHandler}
                                value={key}
                            />
                            <Button variant="contained" style={{ width: '90%', marginTop: '20px', backgroundColor: '#6E4D57', color: 'white', fontWeight: 'bold' }} onClick={verifyHandler}>Verify the reset key </Button>
                        </Box>
                    )
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <TextField
                            required
                            id="outlined-required"
                            label="Email"
                            defaultValue="johndoe@example.com"
                            style={{ width: '90%', margin: '10px' }}
                            name="Email"
                            onChange={changeHandler}
                            value={resetCred.Email}
                        />

                        <p style={{ color: 'red', fontSize: '10px', textAlign: 'left' }}>{emailError}</p>

                        <Button variant="contained" disabled={emailError !== '' } style={{ width: '90%', marginTop: '20px', backgroundColor: 'black', color: 'white', fontWeight: 'bold' }} onClick={resetHandler}>Get a reset key </Button>
                    </Box>
                )}
            </div>
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
};

export default ForgotPass;