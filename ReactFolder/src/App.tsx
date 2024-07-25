import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

import Table from './components/Table';
import SearchBox from './components/SearchBox';

const API_URL = import.meta.env.VITE_API_URL

interface Video { // For passing props to Table (through filteredData)
  Video_Link: string;
  Title: string;
  Published_At: string;
  Thumbnail_URL: string;
  Description: string;
  _id: string;
}

function App() {
  const [responseData, setResponseData] = useState<Video[] | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/data`);
        console.log(response.data)
        setResponseData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const filteredData = responseData?.filter((item: Video) =>
    item.Title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.Description.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <>
      {!responseData ? <p>Loading data... (First loadup of backend server tends to be a bit slow, 5 seconds expected)</p> : (
        <>
          <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
          <Table data={filteredData}/>
        </>
      )}
    </>
  )
}

export default App
