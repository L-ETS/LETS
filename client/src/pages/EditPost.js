import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import regions from './regionData';
import '../styles/Upload.css';
import Form from 'react-bootstrap/Form';

function EditPost() {
  const { postId } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [wideRegion, setWideRegion] = useState('');
  const [detailRegion, setDetailRegion] = useState('');
  const [manualControl, setManualControl] = useState(false);

  const navigate = useNavigate();

  const getPostData = async () => {
    try {
      const response = await axios.get(`/posts/${postId}`);
      console.log(`response.data.images[0].imageUrl: ${JSON.stringify(response.data.images[0].imageUrl)}`);
      const postWideRegion = response.data.post.wideRegion;
      const postDetailRegion = response.data.post.detailRegion;
      const postImages = response.data.images;
      const postTitle = response.data.post.title;
      const postContent = response.data.post.content;
      
      setWideRegion(postWideRegion);
      setDetailRegion(postDetailRegion);
      setImages(postImages);
      setTitle(postTitle);
      setContent(postContent);

      console.log(`postImages:${JSON.stringify(postImages)}`);

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getPostData();
  }, [])

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleNewImageAdd = (e) => {
    const newImages = Array.from(e.target.files);
  
    const newPreviews = newImages.map(image => window.URL.createObjectURL(image));
    
    setImagePreviews(newPreviews);
    
    

    // if(!e.target.files[0]){
    //   setImages([]);
    //   setImagePreviews([]);
    // }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length > 5) {
      alert('최대 5개의 이미지까지 선택할 수 있습니다.');
      return;
    }

    if(images.length == 0) {
      alert('이미지를 선택해주세요.(1장 ~ 5장)')
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
      //put요청으로 바꾸기.
      const response = await axios.put('/posts/:postId/edit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('게시글 수정 완료')
      navigate(`/posts/${postId}`);
        
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
          <Button variant="success" onClick={handleSubmit}>수정완료</Button>
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
          onChange={handleNewImageAdd}
        />
        
      </Form>
      
      <div style={{display: 'flex' }}>

        {imagePreviews.map((image, index) => {
          return (
            <div>
              <img src={image} key={index} style={{width: '150px'}}/>
            </div>
          )
        }
        )}
      </div>
    </div>
  );
}

export default EditPost;