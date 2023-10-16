import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import Button from 'react-bootstrap/Button';

function Upload() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const navigate = useNavigate();

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleImageChange = (e) => {
    const images = Array.from(e.target.files);
    setImages(images);
    
    const previews = images.map((image) => window.URL.createObjectURL(image));
    setImagePreviews([...previews]);

    if(!e.target.files[0]){
      setImages([]);
      setImagePreviews([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length > 5) {
      alert('최대 5개의 이미지까지 선택할 수 있습니다.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    images.forEach((image, index) => {
      formData.append('images', image);
    });


    try {
      const response = await axios.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('서버 응답:', response.data);
      if(response.status === 200) {
          alert('게시글 업로드 완료')
          navigate('/');
        }
    } catch (error) {
      console.error('서버 요청 오류:', error);
    }
  };

  return (
    <div className="upload-group">
      <h1>게시글 작성</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">제목</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={handleTitleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">내용</label>
          <textarea
            id="content"
            name="content"
            value={content}
            onChange={handleContentChange}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="image">이미지 파일</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
          {imagePreviews.map((image, index) => (
            <div key={index}>
              <img src={image}/>
            </div>
          ))}
        </div>
        <Button variant="success" type="submit">게시글 작성</Button>
      </form>
    </div>
  );
}

export default Upload;
