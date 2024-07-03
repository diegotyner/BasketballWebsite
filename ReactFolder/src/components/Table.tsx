// Video_Link,Title,Published_At,Thumbnail_URL,Description
import { useState, useEffect } from 'react';
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

interface Video {
  Video_Link: string;
  Title: string;
  Published_At: string;
  Thumbnail_URL: string;
  Description: string;
}
interface TableProps {
  data: Video[];
}
const Table = ({data}: TableProps) => {
  const[sort, setSort] = useState<'asc' | 'desc'>('desc');
  const [sortedData, setSortedData] = useState([...data]);

  useEffect(() => {
    if (sort === 'asc') {setSortedData([...data])}
    else {setSortedData([...data].reverse())}
  }, [sort, data])

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
          <th className='custom-width-link'><span>Video Link</span></th>
          <th className='custom-width-thumb'><span>Thumbnail and Title</span></th>
          <th className='custom-width-pub clickable' onClick={() => handleHeaderClick()}>
            <span>Published</span>
            <span><Caret direction={sort}/></span>
          </th>
          <th><span>Description</span></th>
        </tr>
      </thead>
      <tbody>
      { sortedData.length === 0 && <tr key="1"><td colSpan={5}>
        <span>No videos found :(</span>
        </td>
      </tr>}
      {sortedData.map((user, index) => (
        <tr key={index}>
          <th>{index+1}</th>
          <td>
            <a className="link-offset-2" href={user.Video_Link} target="_blank">Link</a>
          </td>
          {/* Thumbnail is 480x360 */}
          <td className='thumb-col'>
            <img src={user.Thumbnail_URL} alt="Thumbnail of YT vid"/> 
            <span>{user.Title}</span>
          </td>
          <td>{user.Published_At}</td>
          <td>{user.Description}</td>
        </tr>
      ))}
      </tbody>
    </table>
  )
}
export default Table;
