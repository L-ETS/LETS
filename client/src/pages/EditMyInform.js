import React from "react";
import Button from 'react-bootstrap/Button';
import styles from '../styles/MyInform.module.css'; 
import { useNavigate } from 'react-router-dom';




function EditMyInform() {

    const routing =  useNavigate();

    function goMyInform() {
		routing('/user/myinform');
	}

    return (
        <div className={styles.container}>
            <table>
                <tr>
                    <td className={styles.tableBold}>아이디</td>
                    <td>test</td>
                </tr>
                
                <tr>
                    <td className={styles.tableBold}>비밀번호</td>
                    <td><input type="password" placeholder="••••••••••" /></td>
                </tr>
                
                <tr>
                    <td className={styles.tableBold}>비밀번호 확인</td>
                    <td><input type="password" placeholder="••••••••••" /></td>
                </tr>

                <tr>
                    <td className={styles.tableBold}>닉네임</td>
                    <td><input type="text" placeholder="기존 닉네임"/></td>
                </tr>

                <tr>
                    <td className={styles.tableBold}>이메일</td>
                    <td><input type="text" placeholder="기존 이메일"/></td>
                </tr>

                <tr>
                    <td className={styles.tableBold}>거래 희망 지역</td>
                    <td>**select 버튼 수정 예정**</td>
                </tr>
            </table>

            <Button variant="outline-success" onClick={goMyInform}>회원정보 수정</Button>{' '}
        </div>
    )
}

export default EditMyInform;