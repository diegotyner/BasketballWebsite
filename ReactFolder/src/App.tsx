import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

import data from './assets/YT_Basketball.json';
import Table from './components/Table';
import SearchBox from './components/SearchBox';

const API_URL = import.meta.env.VITE_API_URL

interface Video { // For passing props to Table (through filteredData)
  Video_Link: string;
  Title: string;
  Published_At: string;
  Thumbnail_URL: string;
  Description: string;
}

function App() {
  const [responseData, setResponseData] = useState<Video[]>([])
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(`${API_URL}/api/data`)
        const response = await axios.get(`${API_URL}/api/data`);
        console.log(response.data)
        setResponseData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const filteredData = responseData.filter((item: Video) =>
    item.Title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.Description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
      <Table data={filteredData}/>
    </>
  )
}

export default App
