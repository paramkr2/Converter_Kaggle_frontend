import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [loading, setLoading] = useState(true); // Added loading state

  const restList = async () => {
   
  };

  useEffect(() => {
    restList();
  }, []);

  return (
    <div>
      {loading ? (
        // Loading indicator while fetching data
        <div className="text-center">
          <p>Loading...</p>
        </div>
      ) : (
        <div className="row">
           Not Loading 
        </div>
      )}
    </div>
  );
};

export default Home;
