import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Row, Col, Form, Button } from 'react-bootstrap';
import ListItem from './ListItem';
import CreateTask from './CreateTask'
const Home = () => {
	const apiUrl = import.meta.env.VITE_API_URL;
	const [loading, setLoading] = useState(true); // Added loading state
	const [items, setItems] = useState([]);	
	const [refreshList, setRefreshList] = useState(true);
	const onTaskAdded = async (notebookId, name) => {
	  // Create a new item object
	  const newItem = {
		status: 'pending',
		name,
		createdAt: 'Now', // Use current date and time
		outputFileUrl: '',
		notebookId,
	  };
	  const newItems = [newItem].concat(items);
	  // Update the state by adding the new item to the existing items array
	  //console.log('old items',items)
	  setItems(newItems);
	 
	};
	
	const restList = async () => { 
		try{
			const token = localStorage.getItem('jwtToken');
			const config = {
				headers: { Authorization: `${token}` }
			};
		    const response = await axios.get(`${apiUrl}/api/list`,config)
			const items = response.data;
			console.log(items);
			setItems(items.tasks);
			setLoading(false)
		  }catch(error){
			console.log('ResList Error ',error)
		  }
	}
		
	useEffect(() => {
            restList();
	  });
	
	

	return (
		<div>
		  <Row>
			{/* Column for the list of items */}
			<Col md={8}>
			  <h2>List of Items</h2>
			  {loading ? (
				<p>Loading...</p>
			  ) : (
				items.map(item => (
				  <ListItem item ={item} />
				))
			  )}
			</Col>

        {/* Column for the form */}
        <Col md={4}>
			<CreateTask onTaskAdded={onTaskAdded}/>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
