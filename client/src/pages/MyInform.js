import React from "react";
import Button from 'react-bootstrap/Button';
import styles from '../styles/MyInform.module.css';
import { useNavigate } from 'react-router-dom';


function MyInform() {

  const routing =  useNavigate();

  function goEditMyPage() {
		routing('/posts/editmyinform');
	}

  return (
    <div className={styles.container}>
      <table>
        <tbody>
          <tr>
            <td className={styles.tableBold}>아이디</td>
            <td>test</td>
          </tr>
          <tr>
            <td className={styles.tableBold}>비밀번호</td>
            <td>Test1234</td>
          </tr>
          <tr>
            <td className={styles.tableBold}>비밀번호 확인</td>
            <td>Test1234</td>
          </tr>
          <tr>
            <td className={styles.tableBold}>닉네임</td>
            <td>Test</td>
          </tr>
          <tr>
            <td className={styles.tableBold}>이메일</td>
            <td>test123@gmail.com</td>
          </tr>
          <tr>
            <td className={styles.tableBold}>거래 희망 지역</td>
            <td>경기 수원</td>
          </tr>
        </tbody>
      </table>

      <Button variant="outline-success" onClick={goEditMyPage}>회원정보 수정</Button>{' '}  
      
    </div>
  )
}

export default MyInform;