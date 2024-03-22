import React, { useState } from 'react';
import axios from 'axios';
import { Card, Button, Row, Col, Spinner } from 'react-bootstrap';

const ItemComponent = ({ item }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [status, setStatus] = useState(item.status || 'N/A');
  const name = item.name || 'N/A';
  const createdAt = item.createdAt || 'N/A';
  const [outputFileUrl, setOutputFileUrl] = useState(item.outputFileUrl);
  const [isChecking, setIsChecking] = useState(false);
  
  
  const handleCheck = async () => {
    setIsChecking(true);
    try {
      const token = localStorage.getItem('jwtToken');
      const config = {
        headers: { Authorization: `${token}` },
        params: { notebookId: item.notebookId }
      };
      const response = await axios.get(`${apiUrl}/api/status`, config);
      setStatus(response.data.status);
      if (response.data?.outputFileUrl) {
        setOutputFileUrl(response.data.outputFileUrl);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <Card style={{ marginBottom: '0.1rem', padding: '0.1rem' }}>
      <Card.Body style={{ padding: '0.5rem' }}>
        <Row>
          <Col xs={4}>
            <Card.Text style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {name}
            </Card.Text>
          </Col>
          <Col xs={2}>
            <Card.Text style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {status !== 'complete' ? (
				<Spinner animation="border" variant="danger" />
			  ) : <span style={{ color: 'green' }}>✓</span>}
			
            </Card.Text>
          </Col>
          <Col xs={2}>
            <Card.Text style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {createdAt}
            </Card.Text>
          </Col>
          <Col xs={2}>
            <div style={{ flex: 2 }}>
				{status !== 'complete' ? (
				  <>{isChecking ? <Spinner animation="border" variant="primary" /> : <a href="#" className="custom-link" onClick={handleCheck}>Check</a>}</>
				) : <span style={{ color: 'green' }}>✓</span>}
			  </div>
          </Col>
          <Col xs={2}>
			  {outputFileUrl !== '' && outputFileUrl !== 'Error' && (
				<a href={outputFileUrl} className="custom-link" target="_blank" download>Down</a>
			  )}
			</Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ItemComponent;
