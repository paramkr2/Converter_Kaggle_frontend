import React, { useState } from 'react';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import moment from 'moment';

const ItemComponent = ({ item }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [status, setStatus] = useState(item.status || 'N/A');
  const name = item.name || 'N/A';
  const [outputFileUrl, setOutputFileUrl] = useState(item.outputFileUrl);
  const [isChecking, setIsChecking] = useState(false);
  const createdAtFormatted = moment(item.createdAt).format('HH:mm DD/MM/YY') || item.createdAt;

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
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <td className="text-truncate" style={{ maxWidth: '150px' }}>{name}</td>
      <td className="text-truncate" style={{ maxWidth: '150px' }}>
        {status !== 'complete' ? (
          <Spinner animation="border" variant="success" />
        ) : <span style={{ color: 'green' }}>✓</span>}
      </td>
      <td className="text-truncate" style={{ maxWidth: '150px' }} >
        {createdAtFormatted}
      </td>
      <td>
        {status !== 'complete' ? (
          <>{isChecking ? <Spinner animation="border" variant="primary" /> : <a href="#" className="custom-link" onClick={handleCheck}>Check</a>}</>
        ) : <span style={{ color: 'green' }}>✓</span>}
      </td>
      <td>
        {outputFileUrl !== '' && outputFileUrl !== 'Error' && (
          <a href={outputFileUrl} className="custom-link" target="_blank" download>Down</a>
        )}
      </td>
    </motion.tr>
  );
};

export default ItemComponent;
