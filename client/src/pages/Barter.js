// 로그인이 되었을 때 보일 물물교환 메인페이지.
import {React, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom'
import axios from "axios";

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
      <h1>당근교환</h1>
      <button type="button" onClick={logout}>로그아웃</button>
      <button type="button" onClick={gotoMyPage}>마이페이지</button>
      <button type="button" onClick={postUpload}>게시글 쓰기</button>
      <div>
        <ul style={{listStyle: 'none'}}>
          {
            posts.map((post)=>{ 
              return (
                <li style={{border: '1px solid'}}>
                  <p>글번호: {post.postId}</p>
                  <h3>글제목: {post.title}</h3>
                  <p>작성자: {post.userId}</p>
                </li>
              )
            })
          }
        </ul>
      </div>
    </div>
  )
}

export default Barter;