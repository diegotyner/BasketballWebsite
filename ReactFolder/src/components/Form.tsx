import { useState } from "react";
import './Form.css';

interface Video {
  Video_Link: string;
  Title: string;
  Published_At: string;
  Thumbnail_URL: string;
  Description: string;
  _id?: any;
}

interface FormProps {
  video?: Video;
  type: string;
  callback: (value: string) => void;
}
const Form = ( {video, type, callback}: FormProps) => {
  const [videoLink, setVideoLink] = useState(video?.Video_Link || '');
  const [title, setTitle] = useState(video?.Title || '');
  const [publishedAt, setPublishedAt] = useState(video?.Published_At || '');
  const [thumbnailUrl, setThumbnailUrl] = useState(video?.Thumbnail_URL || '');
  const [description, setDescription] = useState(video?.Description || '');

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const payload = JSON.stringify({vidId: video?._id})
    console.log(payload)
    try {
      const API_URL = import.meta.env.VITE_API_URL
      console.log(`${API_URL}/api/delete`);
      const response = await fetch(`${API_URL}/api/delete`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json'
        },  
        body: payload,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Success:', data);
      window.location.reload();
    } catch (error) {
      alert("Submission Failed")
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = {
      videoLink,
      thumbnailUrl,
      title,
      publishedAt,
      description,
      ...(video?._id && { vidId: video._id })
    };
    console.log(JSON.stringify(formData))
    try {
      const API_URL = import.meta.env.VITE_API_URL
      const method = type === "Add" ? "POST" : "PUT";
      console.log(`${API_URL}/api/${type}`);
      const response = await fetch(`${API_URL}/api/${type}`, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },  
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Success:', data);
      window.location.reload();
    } catch (error) {
      alert("Submission Failed")
      console.error('Error:', error);
    }
  };


  return (
    <div className="overlay">
      <div className="my_container">
        <form onSubmit={handleSubmit}>
          <div className="modal_content">
            <label>{type}</label>
          </div>
          <input
            className="modal_content"
            type='text'
            value={videoLink}
            placeholder={videoLink || "Video Link"}
            required
            onChange={(e) => setVideoLink(e.target.value)}
          />
          <input
            className="modal_content"
            type='text'
            value={thumbnailUrl}
            placeholder={thumbnailUrl || "Thumbnail_URL"}
            required
            onChange={(e) => setThumbnailUrl(e.target.value)}
          />
          <input
            className="modal_content"
            type='text'
            value={title}
            placeholder={title || "Title"}
            required
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="modal_content"
            type='text'
            value={publishedAt}
            placeholder={publishedAt || "Published_At"}
            required
            onChange={(e) => setPublishedAt(e.target.value)}
          />
          <textarea
            className="modal_content"
            value={description}
            placeholder={description || "Description"}
            required
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="modal_content">
            {video && <button className='modal_cancel modal_delete' onClick={handleDelete}>Delete</button>}
            <div className="modal_buttons">
              <button className='modal_cancel' onClick={() => callback('')}>Cancel</button>
              <input className='modal_submit clickable' type="submit" disabled={!videoLink || !thumbnailUrl || !title || !publishedAt || !description} />
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Form