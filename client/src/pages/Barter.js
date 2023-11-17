// 로그인이 되었을 때 보일 물물교환 메인페이지.
import {React, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import ListGroup from 'react-bootstrap/ListGroup';
import regions from './regionData';
import Spinner from 'react-bootstrap/Spinner';
import styles from '../styles/Barter.module.css';
import Badge from 'react-bootstrap/Badge';

function Barter({setIsLogin}) {

  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [wideRegion, setWideRegion] = useState('');
  const [detailRegion, setDetailRegion] = useState('');
  const [manualControl, setManualControl] = useState(false);
  const [loading, setLoading] = useState(true); //로딩중인지 나타냄.(비동기적 성격 때문에 데이터를 불러오기도 전에

  const getUserRegion = async () => {
    try {
      const response = await axios.get('/api/getUserRegion');
      const userWideRegion = response.data.user.wideRegion;
      const userDetailRegion = response.data.user.detailRegion;

      setWideRegion(userWideRegion);
      setDetailRegion(userDetailRegion);
      getBoardList(userWideRegion, userDetailRegion);
    } catch (error) {
      console.log(error);
    }
  }

  const getBoardList = async (wideRegion, detailRegion) => {
    const reqData = {
      wideRegion: wideRegion,
      detailRegion: detailRegion
    }

    try {
      const response = await axios.get('/posts', {
        params: reqData
      });
      setPosts(response.data.posts);
    } catch (error) {
      console.log(error);      
    } finally {
      setLoading(false);
    }
  }

  
  useEffect(() => {
    if(manualControl) {
      getBoardList(wideRegion, detailRegion);
    }
    else {
      getUserRegion();
    }
    
  }, [manualControl, wideRegion, detailRegion])
  

  const logout = async() => {
    try {
      const response = await axios.get('/user/logout');
      if(response.status === 200 && response.data.success) {
        setIsLogin(false);
        navigate('/');
      }
      else if(response.status === 500 && !response.data.success) {
        alert('로그아웃에 실패했습니다.')
      }
    } catch(error) {
      console.log(error);
      alert('로그아웃 에러.');
    }
  }

  const gotoMyPage = async() => {
    try {
      const response = await axios.get('/user/mypage');
      if(response.status === 200 && response.data.success) {
        navigate('/user/mypage');
      }
      
    } catch(error) {
      console.log(error);
      alert('로그인이 필요한 서비스입니다.');
      navigate('/');
    }
  }

  const postUpload = async() => {
    try {
      const response = await axios.get('/posts/upload');
      if(response.status === 200 && response.data.success) {
        navigate('/posts/upload');
      }
      
    } catch(error) {
      console.log(error);
      alert('잘못된 접근입니다.');
      navigate('/');
    }
  }

  return (
    <div className={styles.container}>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
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
        <span><Button variant="success" onClick={logout}>로그아웃</Button></span>
        
      </div>
      
      <div>
        <ListGroup>
          {
            posts.length === 0 && loading === false ?
            <h4 style={{textAlign:'center', margin: '200px 200px'}}>게시글이 없습니다.</h4>
            :

            posts.map((post, index)=>{ 
              
              let create = new Date(post.create_date);
              let update = new Date(post.update_date);
              
              //create보다 update시점이 더 미래일 때. 즉, 글 수정을 한 게시글일 때.
              if(create < update) {
                //수정일을 표기하기.
                return (
                  <ListGroup.Item key={index} onClick={()=>{navigate(`/posts/${post.postId}`);}}>
                    <Badge bg="secondary">{post.p_state}</Badge>
                    <h4>제목: {post.title}</h4>
                    <p>수정일: {update.getFullYear()}년 {update.getMonth()+1}월 {update.getDate()}일</p>
                    <p>작성자: {post.userId}</p>
                    <p>조회수: {post.view_count}</p>
                  </ListGroup.Item>
                )
              }
              //글 수정을 하지 않았을 때.
              else {
                //작성일을 표기하기.
                return (
                  <ListGroup.Item key={index} onClick={()=>{navigate(`/posts/${post.postId}`);}}>
                    <Badge bg="secondary">{post.p_state}</Badge>
                    <h4>제목: {post.title}</h4>
                    <p>작성일: {create.getFullYear()}년 {create.getMonth()+1}월 {create.getDate()}일</p>
                    <p>작성자: {post.userId}</p>
                    <p>조회수: {post.view_count}</p>
                  </ListGroup.Item>
                )
              }
              
            })
          }
        </ListGroup>
      </div>
    </div>
  )
}

export default Barter;