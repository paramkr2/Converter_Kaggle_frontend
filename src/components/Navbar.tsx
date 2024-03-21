import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Navbar';
import { AuthContext } from '../context/authcontext';
import { useNavigate } from 'react-router-dom';

const CustomNavbar = () => {
  const { isLoggedIn, setLoggedIn  } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      // Redirect to login page if token is not present
      navigate('/login');
    } else if(!isLoggedIn) { // to break the infinite loop that occured 
      setLoggedIn(true);
    }
  },[navigate, setLoggedIn, isLoggedIn]); 

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setLoggedIn(false)
	navigate('/login')
  };

  return (
    <Navbar bg="primary" variant="dark">
      <div className="container-fluid">
        <Navbar.Brand as={Link} to="/">
          Food Delivery Frontend
        </Navbar.Brand>
        <Nav className="ml-auto">
          <Container>
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            {isLoggedIn ? (
              <Nav.Link className="btn btn-link" onClick={handleLogout} data-testid="logout-link">
                Logout
              </Nav.Link>
            ) : (
              <Nav.Link as={Link} to="/login">
                Login
              </Nav.Link>
            )}
          </Container>
        </Nav>
      </div>
    </Navbar>
  );
};

export default CustomNavbar;
