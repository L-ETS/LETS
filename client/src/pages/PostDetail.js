import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import '../styles/postdetail.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';  
import Badge from 'react-bootstrap/Badge';

function PostDetail() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [post, setPost] = useState({});
  const [images, setImages] = useState([]);
  const [mainImageSrc, setMainImageSrc] = useState('');
  const [isMyPost, setIsMyPost] = useState(false);
  const [loading, setLoading] = useState(true);
  const [likeBtn, setLikeBtn] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showAlert, setShowAlert] = useState(false);

  const create = new Date(post.create_date);
  const update = new Date(post.update_date);

  const clickLikeBtn = async() => {
    try {
      const response = await axios.post('/user/updateLikepost', { pId : postId, isDelete : likeBtn });
      console.log(response.data);
      setLikeBtn((prevBtnValue) => !prevBtnValue);
    } catch(error) {
      console.log(error);
      alert('잘못된 접근입니다.');
    }
  }

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

  useEffect(() => {
    axios.get('/user/likepost')
      .then(response => {
        //console.log(response.data[0].postId);
        console.log('likepost');
        for (let i=0; i<response.data.length; i++) {
          if (response.data[i].postId == postId) setLikeBtn(true);
        }
      })
      .catch((error) => {
        console.error('데이터 가져오기 오류:', error);
      })
  }, [])

  useEffect(() => {
    axios.get(`/posts/${postId}/likeCount`)
      .then(res => {
        console.log('likecount');
        //console.log(res.data[0].count);
        setLikeCount(res.data[0].count);
      })
      .catch((error) => {
        console.error('데이터 가져오기 오류:', error);
      })
  }, [likeBtn])

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/posts/${postId}`);
      
      if(response.status === 204) {
        alert('게시글 삭제 완료.')

      } else if(response.status === 404) {
        alert('해당 게시물을 찾을 수 없습니다.');

      }
      navigate('/');

    } catch (error) {
      console.log(error);
    }
    
  }
  
  if(loading) {
    return (
      <div style={{display: "flex", justifyContent: "center", alignContent: "center"}}>
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <>
      <Modal show={showAlert} onHide={()=>{setShowAlert(false)}}>
        <Modal.Header closeButton>
          <Modal.Title>정말로 삭제하시겠습니까?</Modal.Title>
        </Modal.Header>
        <Modal.Body>삭제 후 복구할 수 없습니다.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>{setShowAlert(false)}}>
            취소
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            삭제
          </Button>
        </Modal.Footer>
      </Modal>

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
                <div style={{display: "flex", justifyContent: "space-between"}}>   
                  <div>
                    <span>작성자: {post.userId}</span>
                    <br/>
                    <span>수정일: {update.getFullYear()}년 {update.getMonth()+1}월 {update.getDate()}일</span>
                    <br/>
                    <h5><Badge bg="danger">좋아요 {likeCount}</Badge></h5> 
                  </div>    
                  {
                    isMyPost ? 
                    <div>
                      <Button variant="success" onClick={()=>{navigate(`/posts/${postId}/edit`)}}>수정</Button>
                      <Button variant="danger" onClick={()=>{setShowAlert(true)}}>삭제</Button>
                    </div>
                    : 
                    <div>
                      {
                        likeBtn ?
                        <div>
                          <Button variant="danger" onClick={clickLikeBtn}>취소</Button>
                        </div>
                        :
                        <div>
                          <Button variant="outline-danger" onClick={clickLikeBtn}>좋아요</Button>
                        </div>
                      }
                    </div>
                  }
                </div>
                :
                <div style={{display: "flex", justifyContent: "space-between"}}>
                  <div>
                    <span>작성자: {post.userId}</span>
                    <br/>
                    <span>작성일: {create.getFullYear()}년 {create.getMonth()+1}월 {create.getDate()}일</span>
                    <br/>
                    <h5><Badge bg="danger">좋아요 {likeCount}</Badge></h5>
                  </div>
                  {
                    isMyPost ? 
                    <div>
                      <Button variant="success" onClick={()=>{navigate(`/posts/${postId}/edit`)}}>수정</Button>
                      <Button variant="danger" onClick={()=>{setShowAlert(true)}}>삭제</Button>
                    </div>
                    : 
                    <div>
                      {
                        likeBtn ?
                        <div>
                          <Button variant="danger" onClick={clickLikeBtn}>취소</Button>
                        </div>
                        :
                        <div>
                          <Button variant="outline-danger" onClick={clickLikeBtn}>좋아요</Button>
                        </div>
                      }
                    </div>
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
    </>
  )
}


export default PostDetail;
