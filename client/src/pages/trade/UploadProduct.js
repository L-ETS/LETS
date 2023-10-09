import {React, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom'
import axios from "axios";

const UploadProduct = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);

    images.forEach((image, index) => {
      formData.append('images', image);
    });

    try {
      const response = await axios.post('/trade/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Required when sending FormData with axios
        }
      });

      if(response.status === 200) {
        console.log("Server response:", response.data);
        alert('Upload successful!');
        navigate('/');
      }
      

    } catch (error) {
      console.error("Error uploading:", error);
      alert('Upload failed!');
    }

    console.log("Data ready to be sent:", formData); // For demo
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label>Content:</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)}></textarea>
        </div>
        <div>
          <label>Image:</label>
          <input type="file" multiple name='images' onChange={(e) => setImages([...e.target.files])} />
        </div>
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default UploadProduct;
