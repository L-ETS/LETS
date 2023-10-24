import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import regions from './regionData';
import '../styles/Upload.css';
import Form from 'react-bootstrap/Form';

function Upload() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [wideRegion, setWideRegion] = useState('');
  const [detailRegion, setDetailRegion] = useState('');
  const [manualControl, setManualControl] = useState(false);

  const navigate = useNavigate();

  const getUserRegion = async () => {
    try {
      const response = await axios.get('/api/getUserRegion');
      const userWideRegion = response.data.user.wideRegion;
      const userDetailRegion = response.data.user.detailRegion;

      setWideRegion(userWideRegion);
      setDetailRegion(userDetailRegion);

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getUserRegion();
  }, [])

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
    formData.append('wideRegion', wideRegion);
    formData.append('detailRegion', detailRegion);
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
    <div className="container">
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <div style={{display: 'flex'}}>
          <Dropdown style={{marginRight: '10px'}}>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              {wideRegion}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {
                Object.keys(regions).map((wide, index)=>{
                  return (
                    <Dropdown.Item key={index} onClick={()=>{setWideRegion(wide);setManualControl(true);setDetailRegion('선택');}}>{wide}</Dropdown.Item>
                  )
                })
              }
            </Dropdown.Menu>
          </Dropdown>
            
          <Dropdown style={{marginRight: '10px'}}>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              {detailRegion}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {
                wideRegion ?
                regions[wideRegion].map((detail, index)=>{
                  return (
                    <Dropdown.Item key={index} onClick={()=>{setDetailRegion(detail);setManualControl(true);}}>{detail}</Dropdown.Item>
                  )
                }) : null
              }
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div>
          <Button variant="success" onClick={handleSubmit}>게시글 작성</Button>
        </div>
      </div>

      <Form>
     
        <Form.Label htmlFor="title">제목</Form.Label>
        <Form.Control 
          type="text" 
          id='title' 
          name='title'
          value={title} 
          onChange={handleTitleChange} 
          required
        />
    
        <Form.Label htmlFor="content">내용</Form.Label>
        <Form.Control 
          as="textarea" rows={15}
          id="content"
          name="content"
          value={content}
          onChange={handleContentChange}
          required
        />

        <Form.Label htmlFor="image">이미지 파일</Form.Label>
        <Form.Control 
          type="file"
          id="image"
          name="image"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />
        
      </Form>
      
      <div style={{display: 'flex' }}>

        {imagePreviews.map((image, index) => (
          <img src={image} key={index} style={{width: '150px'}}/>
          
        ))}
      </div>
      
    </div>
  );
}

export default Upload;
