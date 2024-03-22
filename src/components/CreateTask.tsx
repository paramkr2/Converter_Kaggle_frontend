import React, { useState } from 'react';
import { Form, FloatingLabel, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateTask = ({ onTaskAdded }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [value, setValue] = useState(18); // Initial value

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const videoUrl = formData.get('videoUrl');
    const crfValue = value; // Use the selected CRF value from the range slider
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
    return !isNaN(crfValue) && crfValue >= 18 && crfValue <= 45;
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

        

        <FloatingLabel controlId="floatingInputName" label="Name" className="mb-3">
          <Form.Control type="text" name="name" placeholder="Enter name" />
        </FloatingLabel>
		
		<Form.Group>
  <div className="d-flex align-items-center">
    <Form.Label className="mr-2">CRF Value:</Form.Label>
    <Form.Range
      min={18} // Minimum value
      max={45} // Maximum value
      step={1} // Step value
      value={value} // Current value
      onChange={handleChange} // Handle change function
    />
    <Form.Text className="ml-2">{value}</Form.Text>
  </div>
</Form.Group>

<Form.Group className="mt-3">
  <Button variant="dark" type="submit" disabled={isFormSubmitting}>
    {isFormSubmitting ? <Spinner animation="border" size="sm" /> : 'Submit'}
  </Button>
</Form.Group>

      </Form>
    </div>
  );
};

export default CreateTask;
