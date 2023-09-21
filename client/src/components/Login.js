import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'
import '../styles/login.css'; 

function Login() {
  
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  //로그인 버튼 눌렀을 때 벌어질 이벤트
  const handleSubmit = (e) => {
    e.preventDefault();

   
  };

  return (
    <div className="login-page">
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="userId">아이디</label>
          <input
            type="text"
            id="userId"
            value={userId}
            maxLength={30}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
        <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            value={password}
            maxLength={30}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">로그인</button>
        <button type="button" onClick={()=>navigate('/user/register')}>회원가입</button>
      </form>
    </div>
  );
}

export default Login;