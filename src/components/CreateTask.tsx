import React, { useState } from 'react';
import { Form, FloatingLabel, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateTask = ({ onTaskAdded }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const videoUrl = formData.get('videoUrl');
    const crfValue = formData.get('crfValue');
    const name = formData.get('name');

    let error = '';
    if (!validateUrl(videoUrl)) { error += 'Invalid URL.\n'; }
    if (!validateCrfValue(crfValue)) { error += 'CRF 18-45.\n'; }
    if (!validateName(name)) { error += 'Name cannot contain spaces.\n'; }
   if (error) {
	  toast.error(
		<div>
		  {error.trim().split('\n').map((line, index) => (
			<div key={index} style={{ textAlign: 'left' }}>
			  {line}
			</div>
		  ))}
		</div>,
		{ autoClose: false }
	  );
	  return;
	}
    try {
      setIsFormSubmitting(true);
      const token = localStorage.getItem('jwtToken');
      const config = {
        headers: { Authorization: `${token}` },
      };
      const response = await axios.post(`${apiUrl}/api/create`, { videoUrl, crfValue, name }, config);

      if (response.status === 201) {
        await onTaskAdded(response.data.notebookId, name);
      } else {
        console.log('CreateTask Error', response.data);
      }
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      toast.success('Task created successfully!');
      setIsFormSubmitting(false);
    }
  };

  const validateUrl = (url) => {
    return url && url.startsWith('http');
  };

  const validateCrfValue = (crfValue) => {
    const value = parseInt(crfValue);
    return !isNaN(value) && value >= 18 && value <= 45;
  };

  const validateName = (name) => {
    return name && !/\s/.test(name);
  };

  return (
    <div style={{ backgroundColor: '#f4f4f4', padding: '20px' }}>
      <h2>Create New Task</h2>
      <Form onSubmit={handleSubmit}>

        <FloatingLabel controlId="floatingInputVideoUrl" label="Video Url" className="mb-3">
          <Form.Control type="text" name="videoUrl" placeholder="Enter video URL" />
        </FloatingLabel>

        <FloatingLabel controlId="floatingInputCrfValue" label="CRF Value" className="mb-3">
          <Form.Control type="text" name="crfValue" placeholder="Enter CRF value" />
        </FloatingLabel>

        <FloatingLabel controlId="floatingInputName" label="Name" className="mb-3">
          <Form.Control type="text" name="name" placeholder="Enter name" />
        </FloatingLabel>

        <Button variant="dark" type="submit" disabled={isFormSubmitting}>
          {isFormSubmitting ? <Spinner animation="border" size="sm" /> : 'Submit'}
        </Button>
      </Form>
    </div>
  );
};

export default CreateTask;
