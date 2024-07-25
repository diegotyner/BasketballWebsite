import { useState, useEffect } from 'react';
import Caret from './Caret'
import Form from './Form';



interface Video {
  Video_Link: string;
  Title: string;
  Published_At: string;
  Thumbnail_URL: string;
  Description: string;
  _id: string;
}
interface TableProps {
  data: Video[];
}
const Table = ({data}: TableProps) => {
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');
  const [sortedData, setSortedData] = useState([...data]);
  const [popUp, setPopUp] = useState('')
  const [video, setVideo] = useState<Video | undefined>(undefined)

  useEffect(() => {
    if (sort === 'asc') {setSortedData([...data])}
    else {setSortedData([...data].reverse())}
  }, [sort, data])

  function handleHeaderClick() {
    setSort(prevSort => prevSort === 'asc' ? 'desc' : 'asc'); // direction = sort === 'asc' ? 'desc' : 'asc';
  }
  const handeEditClick = (video: Video) => {
    setVideo(video)
    console.log(video)
    setPopUp("Edit")
  };
  const handeAddClick = () => {
    setVideo(undefined)
    setPopUp("Add")
  };
  return (
    <>
      {popUp && <Form type={popUp} callback={setPopUp} video={video}/>}

      <table className='table table-bordered align-middle'>
        <thead className='table-dark'>
          <tr>
            <th className='custom-width-num'><span>#</span></th>
            <th className='custom-width-thumb'><span>Thumbnail and Title</span></th>
            <th className='custom-width-pub clickable' onClick={() => handleHeaderClick()}>
              <span>Published</span>
              <span><Caret direction={sort}/></span>
            </th>
            <th><span>Description</span></th>
            <th className='custom-width-add '><button className='clickable' onClick={handeAddClick}>Add New</button></th>
          </tr>
        </thead>
        <tbody>
        { sortedData.length === 0 && <tr key="1"><td colSpan={5}>
          <span>No videos found</span>
          </td>
        </tr>}
        {sortedData.map((video, index) => (
          <tr key={index}>
            <td className='fw-bold'>{index+1}</td>
            {/* Thumbnail is 480x360 */}
            <td className='thumb-col'>
              <img src={video.Thumbnail_URL} alt="Thumbnail of YT vid" className="clickable" onClick={() => window.open(video.Video_Link, '_blank')}/> 
              <span>{video.Title}</span>
            </td>
            <td>{video.Published_At}</td>
            <td>{video.Description}</td>
            <td><img src={'assets/wrench.svg'} alt="wrench icon" className="clickable" onClick={() => handeEditClick(video)}/></td>
          </tr>
        ))}
        </tbody>
      </table>
    </>
  )
}
export default Table;
