import React ,{useState} from 'react';
import { Form, Button, Alert , Spinner } from 'react-bootstrap'; // Import Alert for displaying error messages
import axios from 'axios';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
const CreateTask = ({ onTaskAdded }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
	const [isFormSubmitting,setIsFormSubmitting] = useState(false)
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const videoUrl = formData.get('videoUrl');
    const crfValue = formData.get('crfValue');
    const name = formData.get('name');
	
	
    let error = '';
    if (!validateUrl(videoUrl)) { error += 'Invalid video URL format.\n'; }
    if (!validateCrfValue(crfValue)) {  error += 'CRF value must be between 18 and 45.\n'; }
    if (!validateName(name)) { error += 'Name cannot contain spaces.\n'; }
    if (error) {
      toast.error(error.trim());
      return;
    }

    try {
	setIsFormSubmitting(true)
      const token = localStorage.getItem('jwtToken');
      const config = {
        headers: { Authorization: `${token}` },
      };
      const response = await axios.post(`${apiUrl}/api/create`, { videoUrl, crfValue, name }, config);

      console.log(response.data);
      if (response.status === 201) {
        await onTaskAdded(response.data.notebookId, name);
      } else {
        console.log('CreateTask Error', response.data);
      }
    } catch (error) {
      console.error('Error creating task:', error);
    } finally{
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
    <>
      <h2>Create New </h2>
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
          {isFormSubmitting ? <Spinner animation="border" size="sm" /> : 'Submit'} 
        </Button>
      </Form>
	  
    </>
	
  );
};

export default CreateTask;
