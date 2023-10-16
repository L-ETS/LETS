// 로그인이 되었을 때 보일 물물교환 메인페이지.
import {React, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import Button from 'react-bootstrap/Button';

function Barter({setIsLogin}) {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  const getBoardList = async () => {
    try {
      const response = await axios.get('/posts');
      setPosts(response.data.posts);
    } catch (error) {
      console.log(error);      
    }
  }
  
  useEffect(() => {
    getBoardList();
  }, [])
  

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
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <span><h1>등록된 물건</h1></span>
        <span><Button variant="success" onClick={logout}>로그아웃</Button></span>
        
      </div>
      
      <div>
        <ul style={{listStyle: 'none'}}>
          {
            posts.map((post, index)=>{ 
              
              let create = new Date(post.create_date);
              let update = new Date(post.update_date);
              
              //create보다 update시점이 더 미래일 때. 즉, 글 수정을 한 게시글일 때.
              if(create < update) {
                //수정일을 표기하기.
                return (
                  <li style={{border: '1px solid'}} key={index} onClick={()=>{navigate(`/posts/${post.postId}`);}}>
                    <h3>제목: {post.title}</h3>
                    <p>수정일: {update.getFullYear()}년 {update.getMonth()+1}월 {update.getDate()}일</p>
                    <p>작성자: {post.userId}</p>
                    <p>조회수: {post.view_count}</p>
                  </li>
                )
              }
              //글 수정을 하지 않았을 때.
              else {
                //작성일을 표기하기.
                return (
                  <li style={{border: '1px solid'}} key={index} onClick={()=>{navigate(`/posts/${post.postId}`);}}>
                    <h3>제목: {post.title}</h3>
                    <p>작성일: {create.getFullYear()}년 {create.getMonth()+1}월 {create.getDate()}일</p>
                    <p>작성자: {post.userId}</p>
                    <p>조회수: {post.view_count}</p>
                  </li>
                )
              }
              
            })
          }
        </ul>
      </div>
    </div>
  )
}

export default Barter;