// Video_Link,Title,Published_At,Thumbnail_URL,Description
import { useState, useEffect } from 'react';
import data from '../assets/YT_Basketball.json';
import Caret from './Caret'


/*
<table class="table">
  <thead class="table-dark">
    ...
  </thead>
  <tbody>
    ...
  </tbody>
</table>
*/
const Table2 = () => {
  const[sort, setSort] = useState<'asc' | 'desc'>('desc');
  const [sortedData, setSortedData] = useState([...data]);

  useEffect(() => {
    if (sort === 'asc') {setSortedData([...data])}
    else {setSortedData([...data].reverse())}
  }, [sort])

  function handleHeaderClick() {
    // const direction = sort === 'asc' ? 'desc' : 'asc';
    console.log(sort, '=>')
    setSort(prevSort => prevSort === 'asc' ? 'desc' : 'asc');
    console.log(sort)
  }

  return (
    <table className='table table-bordered align-middle'>
      <thead className='table-dark'>
        <tr>
          <th><span>#</span></th>
          <th><span>Video Link</span></th>
          <th><span>Title</span></th>
          <th className='custom-width' onClick={() => handleHeaderClick()}>
            <span>Published</span>
            <span><Caret direction={sort}/></span>
          </th>
          <th><span>Thumbnail</span></th>
          <th><span>Description</span></th>
        </tr>
      </thead>
      <tbody>
      {sortedData.map((user, index) => (
        <tr key={index}>
          <th>{index+1}</th>
          <td>{user.Video_Link}</td>
          <td>{user.Title}</td>
          <td>{user.Published_At}</td>
          {/* Thumbnail is 480x360 */}
          <td>
            <img src={user.Thumbnail_URL} alt="Thumbnail of YT vid"/> 
          </td>
          <td>{user.Description}</td>
        </tr>
      ))}
      </tbody>
    </table>
  )
}
export default Table2;
