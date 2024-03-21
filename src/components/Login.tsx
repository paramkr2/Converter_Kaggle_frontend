import React, { useState,useContext } from 'react';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {AuthContext} from '../context/authcontext' 
const Login = () => {
	const { isLoggedIn, setLoggedIn  } = useContext(AuthContext);
	const navigate = useNavigate();
	const [username, setUsername] = useState('');
	const [key, setKey] = useState('');
	const [error, setError] = useState('');
	const handleSubmit = async (event) => {
		event.preventDefault();
		
		if (!username || !key) {
		  setError('Please enter both username and API key.');
		  return;
		}
		const payload = {
		  username,
		  key,
		};
		try {
		  const response = await axios.post('https://facebookapi.up.railway.app/api/login', payload);
		  const token = response.data.token;
		  // Store the token in local storage for future authorization
		  localStorage.setItem('jwtToken', token);
		  setLoggedIn(true)
		  navigate('/');
		  // Redirect to home page or dashboard
		} catch (error) {
		  console.error('Error logging in', error);
		}
	  };

	  return (
		<Form onSubmit={handleSubmit}>
		  <Form.Group controlId="formBasicEmail">
			<Form.Label>Username</Form.Label>
			<Form.Control type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
		  </Form.Group>

		  <Form.Group controlId="formBasicKey">
			<Form.Label>Key</Form.Label>
			<Form.Control type="text" placeholder="Enter API key" value={key} onChange={(e) => setKey(e.target.value)} />
		  </Form.Group>

		  <Button variant="primary" type="submit">
			Submit
		  </Button>
		</Form>
	  );
};

export default Login;
