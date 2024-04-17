import React, { useState } from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../CSS/Auth.css'
import Box from '@mui/material/Box';
import { BaseUrl } from './Baseurl';



import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Auth = () => {


    const navigate = useNavigate();
    const [account, setAccount] = useState(true);
    const [toaststate, setToastState] = useState(false)
    const [logincred, setLogincred] = useState({
        Email: '',
        Password: ''
    })
    const [signupcred, setSignupcred] = useState({
        Email: '',
        FirstName: '',
        LastName: '',

        Password: ''
    });
    const [authToken, setAuthToken] = useState('')
    const [loader, setLoader] = useState(false)
    const [FirstnameError, setFirstNameError] = useState('')
    const [LastnameError, setLastNameError] = useState('')
    const [PassError, setPassError] = useState('')

    function signupHandler() {
        setAccount(false);
    }

    function loginHandler() {
        setAccount(true);
    }

    
    
    function signupcredHandler(e) {
        const { name, value } = e.target;
        setSignupcred({ ...signupcred, [name]: value });
    
        // Check which field is being edited and set the appropriate error message
        const nameRegex = /^[A-Z][a-zA-Z0-9]{2,}/;
        const passRegex = /^(?=.*[A-Z])[a-zA-Z0-9]{6,}/;
        if (name === 'FirstName' && !nameRegex.test(value)) {
            setFirstNameError('Min 3 Characters Required & First Character Should Be Uppercase');
        } else if (name === 'LastName' && !nameRegex.test(value)) {
            setLastNameError('Min 3 Characters Required & First Character Should Be Uppercase');
        }else if (name === 'Password' && !passRegex.test(value)){
            setPassError('Min 6 Characters Required & Must Contain Min 1 Uppercase Character')
        }
        
        else {
            setFirstNameError('');
            setLastNameError('');
            setPassError('');
        }
    }
    

    function logincredHandler(e) {
        const { name, value } = e.target;
        setLogincred({ ...logincred, [name]: value });
        const passRegex = /^(?=.*[A-Z])[a-zA-Z0-9]{6,}/;

        if (!value) {
            setPassError(''); // Clear the error message if the password is empty
        } else if (name=='Password' && !passRegex.test(value)) {
            setPassError('Min 6 Characters Required & Must Contain Min 1 Uppercase Character');
        } else {
            setPassError('');
        }
    }


    function openLoader() {
        setLoader(true)
    }

    function closeLoader() {
        setLoader(false)
    }

    const wrongCreds = () => toast("Incorrect Credentials!!");
    const wrongEmailFormat = () => toast("Enter A Valid Email");
    const enterCreds = () =>toast("Enter All Required Fields");
    const emailExists = () =>toast("Email Already Exists");



    async function signUp() {


        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (signupcred.Email === '' || signupcred.FirstName === '' || signupcred.LastName === '' || signupcred.DOB === '' || signupcred.Password === '') {
            enterCreds()
        } else if (!emailRegex.test(signupcred.Email)) {
            wrongEmailFormat()
        } else {

            try {
                openLoader()
                const response = await fetch(`${BaseUrl}/signup`, {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(signupcred),
                });



                if (response.ok) {
                    const res = await response.json();

                    setAuthToken(res.token);

                    localStorage.setItem('token', res.token);
                    navigate('/home')
                } else {

                    emailExists()
                }
            } catch (error) {
                console.log(error);
            } finally {
                closeLoader()
            }

        }

    }



    async function login() {

        openLoader()
        try {
            const response = await fetch(`${BaseUrl}/login`, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(logincred),
            });

            console.log(response.status)

            if (response.ok) {
                const res = await response.json();

                setAuthToken(res.token);

                localStorage.setItem('token', res.token);
                navigate('/home')
            } else {
                // alert("invalid credentials")
                wrongCreds();
            }
        } catch (error) {
            console.log(error);
        } finally {
            closeLoader()
        }
    }

    function navigateToReset() {
        navigate('/reset')
    }







    return (

        <div>

            {
                loader && <div>

                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={openLoader}
                        onClick={closeLoader}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                </div>
            }



            {account ? <Container className='authcontainer'>



                <Row>



                    <Col lg={12} md={12} sm={12} xs={12}>



                        <div style={{ width: '500px', height: '400px', backgroundColor: 'white', boxShadow: '3px 3px rgba(0, 0, 0, 0.43)', borderRadius: '10px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} className='Credbox'>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <TextField
                                    required
                                    id="outlined-required"
                                    label="Email"
                                    defaultValue="johndoe@example.com"
                                    style={{ width: '90%', margin: '10px' }}
                                    name='Email'
                                    onChange={logincredHandler}
                                    value={logincred.Email}
                                />
                                <TextField
                                    id="outlined-password-input"
                                    label="Password"
                                    type="password"
                                    autoComplete="current-password"
                                    style={{ width: '90%', margin: '10px' }}
                                    name='Password'
                                    onChange={logincredHandler}
                                    value={logincred.Password}
                                />
                                <p style={{ color: 'red', fontSize: '10px', textAlign: 'left' }}>{PassError}</p>
                                <Button
                                    variant="contained"
                                    style={{ width: '90%', marginTop: '20px', backgroundColor: 'blue' }}
                                    onClick={login}
                                    disabled={PassError !== ''}
                                >
                                    Login
                                </Button>
                                <hr style={{ width: '100%', borderTop: '2px solid black', margin: '20px 0' }} />
                                <Button variant="contained" style={{ width: '90%', marginTop: '20px', backgroundColor: 'black', color: 'white', fontWeight: 'bold' }} onClick={signupHandler}>Create a New Account </Button>
                                <h6 style={{ textAlign: 'center', color: 'blue', marginTop: '20px', cursor: 'pointer' }} onClick={navigateToReset}>Forgot Password?</h6>

                            </Box>






                        </div>


                    </Col>

                </Row>
            </Container> : <Container className='authcontainer'>

                <Row>

                    <Col lg={12} md={12} sm={12} xs={12}>
                        <div style={{ width: '500px', height: '550px', backgroundColor: 'white', boxShadow: '3px 3px rgba(0, 0, 0, 0.43)', borderRadius: '10px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} className='Credbox'>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <TextField
                                    required
                                    id="outlined-required"
                                    label="Email"
                                    name='Email'
                                    style={{ width: '90%', margin: '10px' }}
                                    onChange={signupcredHandler}
                                    value={signupcred.Email}
                                />
                                <TextField
                                    required
                                    id="outlined-required"
                                    label="FirstName"
                                    name='FirstName'
                                    style={{ width: '90%', margin: '10px' }}
                                    onChange={signupcredHandler}
                                    value={signupcred.FirstName}
                                />

                                <p style={{ color: 'red', fontSize: '10px', textAlign: 'left' }}>{FirstnameError}</p>

                                <TextField
                                    required
                                    id="outlined-required"
                                    label="LastName"
                                    name='LastName'
                                    style={{ width: '90%', margin: '10px' }}
                                    onChange={signupcredHandler}
                                    value={signupcred.LastName}
                                />

                                <p style={{ color: 'red', fontSize: '10px', textAlign: 'left' }}>{LastnameError}</p>



                                <TextField
                                    id="outlined-password-input"
                                    label="Password"
                                    type="password"
                                    autoComplete="current-password"
                                    name='Password'
                                    style={{ width: '90%', margin: '10px' }}
                                    onChange={signupcredHandler}
                                    value={signupcred.Password}
                                />
                                 <p style={{ color: 'red', fontSize: '10px', textAlign: 'left' }}>{PassError}</p>
                                <Button variant="contained" disabled={FirstnameError !== '' || LastnameError !== '' || PassError !==''} style={{ width: '90%', marginTop: '20px', backgroundColor: 'blue' }} onClick={signUp}>Sign Up</Button>
                                <hr style={{ width: '100%', borderTop: '2px solid black', margin: '20px 0' }} />
                                <Button variant="contained" style={{ width: '90%', marginTop: '20px', backgroundColor: 'black', color: 'white', fontWeight: 'bold' }} onClick={loginHandler}>Already Have An Account? </Button>

                            </Box>




                        </div>
                    </Col>
                </Row>



            </Container>
            }

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

        </div>




    )
}

export default Auth;