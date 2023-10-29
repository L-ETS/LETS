import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import '../styles/postdetail.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';

function PostDetail() {
  const navigate = useNavigate();
  const { postId } = useParams();

  const [post, setPost] = useState({});
  const [images, setImages] = useState([]);
  const [mainImageSrc, setMainImageSrc] = useState('');
  const [isMyPost, setIsMyPost] = useState(false);
  const [loading, setLoading] = useState(true);

  const create = new Date(post.create_date);
  const update = new Date(post.update_date);

  useEffect(() => {
    axios.get(`/posts/${postId}`)
      .then(response => {

        setImages(response.data.images);
        setPost(response.data.post);
        setMainImageSrc(response.data.images[0].imageUrl);
        setIsMyPost(response.data.isMyPost);
      })
      .catch(error => {
        console.log(error);
      })
      .finally(()=>{
        setLoading(false);
      })
  }, [postId]);
  
  if(loading) {
    return (
      <div style={{display: "flex", justifyContent: "center", alignContent: "center"}}>
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Container className="container">
      <Row>
        <Col>
          <h2>{post.title}</h2>
          
          <div >
            <img style={{maxWidth: '100%', height: '410px'}} src={mainImageSrc} alt="Main Preview" fluid />
          </div>
            {
              images.map((image, index)=>{
                return (

                  <div key={index} style={{display:"inline-block"}}>
                    <img  width='40px' src={image.imageUrl} onMouseEnter={() => setMainImageSrc(image.imageUrl)}/>
                  </div>
                  
                )
              })
            }
        </Col>
        <Col>
          <div style={{margin: '10px 0', borderBottom: '1px solid'}}>
            {
              create < update ?
              <div>
                <div>
                  <span>작성자: {post.userId}</span>
                  <br/>
                  <span>수정일: {update.getFullYear()}년 {update.getMonth()+1}월 {update.getDate()}일</span>        
                </div>  
                {
                  isMyPost ? 
                  <div>
                    <Button variant="success" onClick={()=>{navigate(`/posts/${postId}/edit`)}}>수정</Button>
                    <Button variant="danger">삭제</Button>
                  </div>
                  : 
                  null
                }  
              </div>
              :
              <div style={{display: "flex", justifyContent: "space-between"}}>
                <div>
                  <span>작성자: {post.userId}</span>
                  <br/>
                  <span>작성일: {create.getFullYear()}년 {create.getMonth()+1}월 {create.getDate()}일</span>
                </div>
                {
                  isMyPost ? 
                  <div>
                    <Button variant="success" onClick={()=>{navigate(`/posts/${postId}/edit`)}}>수정</Button>
                    <Button variant="danger">삭제</Button>
                  </div>
                  : 
                  null
                } 
              </div>
            }
          </div>
          
          <p>
            {post.content}
          </p>
        </Col>
      </Row>
    </Container>
  )
}

export default PostDetail;