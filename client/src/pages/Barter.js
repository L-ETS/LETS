// 로그인이 되었을 때 보일 물물교환 메인페이지.
import {React, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import ListGroup from 'react-bootstrap/ListGroup';

function Barter({setIsLogin}) {
  const regions = {
    
    '경기': ['수원시', '고양시', '성남시', '용인시', '부천시', '안산시', '남양주시', '안양시', '화성시', '평택시', '의정부시', '시흥시', '파주시', '김포시', '광명시', '광주시', '군포시', '오산시', '이천시', '양주시', '안성시', '구리시', '포천시', '의왕시', '하남시', '여주시', '양평군', '동두천시', '과천시', '가평군', '연천군', ],

    '서울': ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'],
  
  };

  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [wideRegion, setWideRegion] = useState('');
  const [detailRegion, setDetailRegion] = useState('');
  const [manualControl, setManualControl] = useState(false);

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
        alert('로그아웃 되었습니다.');
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
    <div className='container'>
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
            posts.map((post, index)=>{ 
              
              let create = new Date(post.create_date);
              let update = new Date(post.update_date);
              
              //create보다 update시점이 더 미래일 때. 즉, 글 수정을 한 게시글일 때.
              if(create < update) {
                //수정일을 표기하기.
                return (
                  <ListGroup.Item key={index} onClick={()=>{navigate(`/posts/${post.postId}`);}}>
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