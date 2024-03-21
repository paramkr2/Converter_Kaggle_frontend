import React from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

const CreateTask = ({ onTaskAdded }) => {
	const apiUrl = import.meta.env.VITE_API_URL;
	const handleSubmit = async (event) => {
		event.preventDefault();
		const formData = new FormData(event.target);
		const videoUrl = formData.get('videoUrl');
		const crfValue = formData.get('crfValue');
		const name = formData.get('name');
		
		try {
			const token = localStorage.getItem('jwtToken');
			const config = {
				headers: { Authorization: `${token}` },
				
			  };
		  const response = await axios.post(`${apiUrl}/api/create`, { videoUrl,crfValue,name }, config );
		  console.log(response.data)
		  if( response.status === 201 ){
			  await onTaskAdded(response.data.notebookId,name); 
		  }else{
			console.log('CreateTask Error',response.data )
		  }
		
		} catch (error) {
		  console.error('Error creating task:', error);
		}
	  };

  return (
    <>
      <h2>Form</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="videoUrl">
          <Form.Label>Video URL</Form.Label>
          <Form.Control type="text" name="videoUrl" placeholder="Enter video URL" />
        </Form.Group>

        <Form.Group controlId="crfValue">
          <Form.Label>CRF Value</Form.Label>
          <Form.Control type="text" name="crfValue" placeholder="Enter CRF value" />
        </Form.Group>

        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" name="name" placeholder="Enter name" />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
};

export default CreateTask;
