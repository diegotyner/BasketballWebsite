import { useState } from 'react'
import './App.css'

import data from './assets/YT_Basketball.json';

import Table from './components/Table'
import SearchBox from './components/SearchBox'


interface Video {
  Video_Link: string;
  Title: string;
  Published_At: string;
  Thumbnail_URL: string;
  Description: string;
}

function App() {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredData = data.filter((item: Video) =>
    item.Title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.Description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  console.log(searchQuery, filteredData)
  return (
    <>
      <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
      <Table data={filteredData}/>
    </>
    
  )
}

export default App
