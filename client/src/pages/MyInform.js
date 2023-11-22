import {React, useEffect, useContext, useState} from "react";
import Button from 'react-bootstrap/Button';
import styles from '../styles/MyInform.module.css';
import { useNavigate } from 'react-router-dom';
import UserContext from "../contexts/UserContext";
import axios from "axios";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

function MyInform() {

  const routing =  useNavigate();
  const { logginedUserId } = useContext(UserContext); //현재 로그인된 유저의 아이디
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [wideRegion, setWideRegion] = useState('');
  const [detailRegion, setDetailRegion] = useState('');
  const [showWithDrawalModal, setShowWithDrawalModal] = useState(false);

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`/user/fetchInfo`);
      setUserId(response.data.user.userId);
      setEmail(response.data.user.email);
      setNickname(response.data.user.nickname);
      setWideRegion(response.data.user.wideRegion);
      setDetailRegion(response.data.user.detailRegion);
    } catch (error) {
      console.log(error);
      alert('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  }
  /* 백엔드 코드와 연동 후 주석해제.
  useEffect(()=>{
    fetchUserInfo();
  },[])
  */

  function goEditMyPage() {
		routing('/posts/editmyinform');
	}

  return (
    <div className={styles.container}>
      <WithdrawalModal showWithDrawalModal={showWithDrawalModal} setShowWithDrawalModal={setShowWithDrawalModal}/>
      <table className={styles.table}>
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
          <tr>
            <td className={styles.tableBold}>회원 탈퇴</td>
            <td><Button variant="secondary" onClick={()=>setShowWithDrawalModal(true)}>회원 탈퇴</Button>{' '}</td>
          </tr>
        </tbody>
      </table>

      <Button variant="outline-success" onClick={goEditMyPage}>회원정보 수정</Button>{' '}  
      
    </div>
  )
}

function WithdrawalModal({showWithDrawalModal, setShowWithDrawalModal}) {
    
  const navigate = useNavigate();
  const [password, setPassword] = useState('');

  const handleWithdrawal = async () => {
      
      try {
          const response = await axios.post(`/user/withdrawal`, {
              password: password
          });

          if(response.status === 204) {
              alert('언젠가 또 만나길,,');
              navigate('/');
          } else {
              throw Error('처리되지 않은 응답코드');
          }
          
      } catch (error) {
          if(error.response.status === 401) {
              alert('비밀번호가 일치하지 않습니다.');
              setPassword('');
          } else if(error.response.status === 500) {
              alert('회원탈퇴에 실패했습니다.');
          } else {
              alert('회원탈퇴에 실패했습니다.');
              console.log(error);
          }
      }
  }

  return (
      <Modal show={showWithDrawalModal} onHide={()=>setShowWithDrawalModal(false)}>
          <Modal.Header closeButton>
          <Modal.Title>비밀번호 재확인</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form>
              <Form.Group className="mb-3">
              <Form.Label>비밀번호</Form.Label>
              <Form.Control
                  type="password"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  autoFocus
              />
              </Form.Group>
          </Form>
          </Modal.Body>
          <Modal.Footer>
          <Button variant="secondary" onClick={()=>setShowWithDrawalModal(false)}>
              Close
          </Button>
          <Button variant="danger" onClick={handleWithdrawal}>
              회원탈퇴
          </Button>
          </Modal.Footer>
      </Modal>
  )
}

export default MyInform;