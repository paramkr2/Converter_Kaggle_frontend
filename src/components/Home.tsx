import React, { useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Row, Col, Pagination, Table,Spinner} from 'react-bootstrap';
import ListItem from './ListItem';
import CreateTask from './CreateTask';
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';

const Home = () => {
	const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(true); // Added loading state
  const [items, setItems] = useState([]);  
  const [refreshList, setRefreshList] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  const onTaskAdded = async (notebookId, name) => {

    /* 
      Since we are appending item at the begining of the item, 
      using index as key, items.map((item, index) => ( <ListItem key={index}))
      runs into problem, because react tries to reRender using existing indexes. 

      key={JSON.stringify(item)} solves the issue for now 
      key={item.notebookId} , anything other than index which is unique 

    */


    const newItem = {
      status: 'pending',
      name,
      createdAt: 'Now',
      outputFileUrl: '',
      notebookId,
    };

	  setItems( items => [newItem].concat(items) );

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
		if( error.code == 'ERR_BAD_REQUEST' ){
			localStorage.removeItem('jwtToken')
			navigate('/login' ,  { state: { error: 'Token expired. Please login again.' } })
		  }
      console.log('RestList Error ', error);
    }
  };
	
	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
		setLoading(true);
		setRefreshList(true);
	  };
	 
	const renderSkeletonRows = () => {
      return Array.from({ length: 6 } , (_, rowIndex) => (
                  <tr key={rowIndex}>  
                    { Array.from({length:5}).map( (_,colIndex) => (
						<td key={colIndex}> <Skeleton width={100} /> </td> 
					)) }
                  </tr>
                ))
	};

	 
	 useEffect(() => {
		const delay = setTimeout(() => {
		  setLoading(false);
		}, 2000);
		if (refreshList) {
		  restList(currentPage);
		  setRefreshList(false);
		}
		return () => clearTimeout(delay);
	  }, [refreshList]);
	
	

  return (
    <div>
      <Row>
        <Col md={4}>
          <CreateTask onTaskAdded={onTaskAdded} />
        </Col>
        <Col md={8}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Created</th>
        				<th>Refresh</th>
        				<th>Download</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                renderSkeletonRows()
              ) : (
				    
                items.map((item, index) => (
                  <ListItem key={item.notebookId} item={item} />
                ))
              )}
            </tbody>
          </Table>
          

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
