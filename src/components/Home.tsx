import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Row, Col, Form, Button, ListGroup,Pagination  } from 'react-bootstrap';
import ListItem from './ListItem';
import CreateTask from './CreateTask';

const Home = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(true); // Added loading state
  const [items, setItems] = useState([]);  
  const [refreshList, setRefreshList] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  const onTaskAdded = async (notebookId, name) => {
    const newItem = {
      status: 'pending',
      name,
      createdAt: 'Now',
      outputFileUrl: '',
      notebookId,
    };
    const newItems = [newItem].concat(items);
    setRefreshList(true);
  };

  const restList = async (currentPage) => { 
    try {
      const token = localStorage.getItem('jwtToken');
      const config = {
        headers: { Authorization: `${token}` },
        params: { page: currentPage , limit:itemsPerPage } // Send page number to the API
      };
      const response = await axios.get(`${apiUrl}/api/list`, config);
      setItems(response.data.tasks);
      setTotalPages(response.data.totalPages); // Set the total number of pages
      setLoading(false);
    } catch (error) {
      console.log('RestList Error ', error);
    }
  };
	  const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
		setLoading(true);
		setRefreshList(true);
		setLoading(true);
	  };
	 
	 useEffect(() => {
		if (refreshList) {
		  restList(currentPage);
		  setRefreshList(false);
		}
	  }, [refreshList]);

  return (
    <div>
      <Row>
        <Col md={4}>
          <CreateTask onTaskAdded={onTaskAdded} />
        </Col>
        <Col md={8}>
          <ListGroup>
            {loading ? (
              <p>Loading...</p>
            ) : (
              items.map((item) => (
                <ListGroup.Item key={item.notebookId}>
                  <ListItem item={item} />
                </ListGroup.Item>
              ))
            )}
          </ListGroup>
          <Pagination>
            {Array.from({ length: totalPages }, (_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
