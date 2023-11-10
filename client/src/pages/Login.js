import React, { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom'
import styles from '../styles/login.module.css'; 
import axios from "axios";
import Button from 'react-bootstrap/Button';
import UserContext from "../contexts/UserContext";

function Login({setIsLogin}) {
  
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const { setLogginedUserId } = useContext(UserContext);

  const navigate = useNavigate();

  //로그인 버튼 눌렀을 때 벌어질 이벤트
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/user/login', {
        userId: userId,
        password: password
      });

      // 로그인 성공했을 때의 코드 작성.
      // For example, you might store the JWT token in local storage and redirect the user to the home page
      if(response.status === 200) {
        setIsLogin(true);
        setLogginedUserId(userId);
        navigate('/');
      }

    } catch(error) {
      // Handle different HTTP status codes here, for example:
      if (error.response && error.response.status === 401) {
        alert('아이디와 비밀번호를 다시 확인해주세요.');
      } else {
        alert('오류 발생. 잠시 후 다시 시도해주세요.');
      }
    }
   
  };

  return (
    <div className={styles.login_page}>
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.input_group}>
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
        <div className={styles.input_group}>
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
        <Button variant="success" type="submit">로그인</Button>
        <Button variant="success" type="button" onClick={()=>navigate('/user/register')}>회원가입</Button>
      </form>
      
    </div>
  );
}

export default Login;