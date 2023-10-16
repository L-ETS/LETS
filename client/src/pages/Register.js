import { useState } from 'react';
import '../styles/register.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import Button from 'react-bootstrap/Button';

function Register() {

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [region, setRegion] = useState('');

  const [userIdError, setUserIdError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordCheckError, setPasswordCheckError] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const [emailError, setEmailError] = useState('');
  //const [regionError, setRegionError] = useState('');

  const requestData = {
    userId: userId,
    password: password,
    nickname: nickname,
    email: email,
    region: region
  };

  const [data, setData] = useState({});

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // 회원가입 정규식
    const userIdRegex = /^[a-zA-Z0-9]{4,12}$/;
    const passwordRegex = /^[a-zA-Z0-9]{8,20}$/;
    const nicknameRegex = /^[가-힣a-zA-Z]{2,10}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!userIdRegex.test(userId)) {
      setUserIdError('올바른 아이디 형식이 아닙니다. [대소문자, 숫자로 4 ~ 12자]');
      return;
    } else {
      setUserIdError('');
    }

    if (!passwordRegex.test(password)) {
      setPasswordError('올바른 비밀번호 형식이 아닙니다. [대소문자, 숫자로 8 ~ 20자]');
      return;
    } else {
      setPasswordError('');
    }

    if (passwordCheck !== password) {
      setPasswordCheckError('비밀번호가 일치하지 않습니다.');
      return;
    } else {
      setPasswordCheckError('');
    }

    if (!nicknameRegex.test(nickname)) {
      setNicknameError('올바른 닉네임 형식이 아닙니다. [한글, 대소문자로 2 ~ 10자]');
      return;
    } else {
      setNicknameError('');
    }

    if (!emailRegex.test(email)) {
      setEmailError('올바른 이메일 형식이 아닙니다. [example@example.com]');
      return;
    } else {
      setEmailError('');
    }

    // 백엔드에서 데이터를 처리할 url로 변경
    axios.post('/user/register', requestData)
      .then(response => {
        setData(response.data);
        console.log("register success");
        navigate('/');
      })
      .catch(error => {
        console.error('회원가입 에러: ', error);
      });
      
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
          {userIdError && <p>{userIdError}</p>}
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
          {passwordError && <p>{passwordError}</p>}
        </div>

        <div className="input-group">
          <label htmlFor="passwordCheck">비밀번호 확인</label>
          <input
            type="password"
            id="passwordCheck"
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
            required
          />
          {passwordCheckError && <p>{passwordCheckError}</p>}
        </div>

        <div className="input-group">
          <label htmlFor="nickname">닉네임</label>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
          />
          {nicknameError && <p>{nicknameError}</p>}
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
           {emailError && <p>{emailError}</p>}
        </div>

        <div className="input-group">
          <label htmlFor="region">거래 희망 지역</label>
          <select
            id="region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
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
        <Button variant="success" type="submit">회원가입</Button>
      </form>
    </div>
  );
}

export default Register;