import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router-dom';
import '../CSS/NavComp.css'
import Button from 'react-bootstrap/Button';

function NavComp() {

    const navigate = useNavigate();

    function logout(){
        localStorage.removeItem('token');
        navigate('/')
    }
  return (
    <Navbar expand="lg" className="bg-body-tertiary" id='Navbar'>
      <Container>
        <Navbar.Brand href="#home"><img src='data:image/png;base64,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'/></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <div className='ml-auto'>
           <Button variant="danger" onClick={logout}>Logout</Button>{' '}
        </div>

        
        
      </Container>
    </Navbar>
  );
}

export default NavComp;