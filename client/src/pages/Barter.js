// 로그인이 되었을 때 보일 물물교환 메인페이지.
import React from 'react';
import { useNavigate } from 'react-router-dom'
import axios from "axios";

function Barter({setIsLogin}) {
  const navigate = useNavigate();

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

  return (
    <div>
      <h1>로그인이 되었을 때 보일 물물교환 메인페이지 입니다.</h1>

      <button type="button" onClick={logout}>로그아웃</button>
    </div>
  )
}

export default Barter;