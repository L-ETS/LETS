import { useState } from 'react';
import '../styles/register.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');

  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Handle actual registration logic here
    
  }

  return (
    <div className="register-page">
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>

        <div className="input-group">
          <label htmlFor="userId">아이디</label>
          <input
            type="text"
            id="userId"
            value={userId}
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
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="nickname">닉네임</label>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="location">거래 희망 지역</label>
          <select 
            id="location" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          >
            <option value="">지역 선택</option>
            <option value="서울">서울</option>
            <option value="경기">경기</option>
            <option value="인천">인천</option>
            <option value="대전">대전</option>
            <option value="대구">대구</option>
            <option value="광주">광주</option>
            <option value="울산">울산</option>
            <option value="부산">부산</option>
          </select>
        </div>

        <button type="submit">회원가입</button>
      </form>
    </div>
  );
}

export default Register;