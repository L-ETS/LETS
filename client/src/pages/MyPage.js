import {React, useState} from "react";
import styles from '../styles/MyPage.module.css'; 
import { Link, Outlet} from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from "axios";

function MyPage() {
    const [showWithDrawalModal, setShowWithDrawalModal] = useState(false);

    return(
        
        <div className={styles.container}>
            <WithdrawalModal showWithDrawalModal={showWithDrawalModal} setShowWithDrawalModal={setShowWithDrawalModal}/>
            
            <div className={styles.item}>
                
                <button className={styles.tab}><Link to ="/mypage/mypost">내 글</Link></button>
                <button className={styles.tab}><Link to ="/mypage/othertrade">다른 거래</Link></button>
                <button className={styles.tab}><Link to ="/mypage/bookmark">북마크</Link></button>
                <button className={styles.tab}><Link to ="/mypage/myinform">회원정보</Link></button>
                <button className={styles.tab} onClick={()=>setShowWithDrawalModal(true)}>회원탈퇴</button>
            </div>

            <div className={styles.content}>
                <Outlet/>
            </div>


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


export default MyPage;