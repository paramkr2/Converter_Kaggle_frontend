import React, { useState } from 'react';
import axios from 'axios';
import { Card, Button, Row, Col } from 'react-bootstrap';

const ItemComponent = ({ item }) => {
	const apiUrl = import.meta.env.VITE_API_URL;
  const [status, setStatus] = useState(item.status || 'N/A');
  const name = item.name || 'N/A';
  const createdAt = item.createdAt || 'N/A';
  const [outputFileUrl, setOutputFileUrl] = useState(item.outputFileUrl );

  const handleCheck = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const config = {
        headers: { Authorization: `${token}` },
        params: { notebookId: item.notebookId }
      };
      const response = await axios.get(`${apiUrl}/api/status`, config);

      // Update the status of the item in the UI
      setStatus(response.data.status); // Assuming the server returns the new status
      if (response.data?.outputFileUrl) {
        setOutputFileUrl(response.data.outputFileUrl);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <Card style={{ marginBottom: '1rem' }}>
      <Card.Body>
        <Row>
          <Col xs={4}>
            <Card.Text style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {name}
            </Card.Text>
          </Col>
          <Col xs={2}>
            <Card.Text style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {status}
            </Card.Text>
          </Col>
          <Col xs={2}>
            <Card.Text style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {createdAt}
            </Card.Text>
          </Col>
          <Col xs={2}>
            {status !== 'completed' && (
              <Button variant='primary' onClick={handleCheck}>Check</Button>
            )}
          </Col>
          <Col xs={2}>
            {outputFileUrl !== '' && outputFileUrl !== 'Error' && (
              <Button variant="primary" href={outputFileUrl} target="_blank">
                Down
              </Button>
            )}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ItemComponent;
