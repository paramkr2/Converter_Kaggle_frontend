import React, { useState,useContext } from 'react';
import axios from 'axios';
import { Button, Form, Alert , Spinner  } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {AuthContext} from '../context/authcontext' 
const Login = () => {
	const apiUrl = import.meta.env.VITE_API_URL;
	const { isLoggedIn, setLoggedIn  } = useContext(AuthContext);
	const navigate = useNavigate();
	const [username, setUsername] = useState('');
	const [key, setKey] = useState('');
	const [error, setError] = useState('');
	const [isFormSubmitting,setIsFormSubmitting] = useState(false)
	
	
	const handleSubmit = async (event) => {
		event.preventDefault();
		
		if (!username || !key) {
		  setError('Please enter both username and API key.');
		  return;
		}
		setIsFormSubmitting(true);
		const payload = {
		  username,
		  key,
		};
		try {
		  const response = await axios.post(`${apiUrl}/api/login`, payload);
		  const token = response.data.token;
		  // Store the token in local storage for future authorization
		  localStorage.setItem('jwtToken', token);
		  setLoggedIn(true)
		  navigate('/');
		  // Redirect to home page or dashboard
		} catch (error) {
			if (error.response && error.response.status == 401) {
			  setError('Invalid username or password. Please try again.');
			} else {
			  console.error('Error logging in', error);
			  setError('An error occurred while logging in. Please try again later.');
			}
		} finally{
			setIsFormSubmitting(false);
		}
	  };

	  return (
	  
		<div>
			{error && <Alert variant="danger">{error}</Alert>} {/* Display error message */}
			<Form onSubmit={handleSubmit}>
			  <Form.Group controlId="formBasicEmail">
				<Form.Label>Username</Form.Label>
				<Form.Control id type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)}  autoComplete="username" />
			  </Form.Group>

			  <Form.Group controlId="formBasicKey">
				<Form.Label>Key</Form.Label>
				<Form.Control type="password" placeholder="Enter API key" value={key} onChange={(e) => setKey(e.target.value)} autoComplete="current-password"/>
			  </Form.Group>

			  <Button variant="primary" type="submit">
				{isFormSubmitting ? <Spinner animation="border" size="sm" /> : 'Submit'} 
			  </Button>
			</Form>
		</div>
	);
		
};

export default Login;
