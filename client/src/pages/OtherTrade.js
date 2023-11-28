import React from "react";
import Button from 'react-bootstrap/Button';
import styles from '../styles/OtherTrade.module.css';

function OtherTrade() {
    
    return (
        <div className={styles.container}>
            <div className={styles.postStatus}>
                <Button variant="outline-success">전체 글</Button>{' '}
                <Button variant="outline-success">예약중</Button>{' '}
                <Button variant="outline-success">거래 완료</Button>{' '}  
            </div>
            
            <div>
                <div>글 제목</div>
                <div>작성자</div>
                <div>글 내용은~~~ 상위 div 반복으로 붙여넣기!</div>
            </div>
        </div>
    )
}


export default OtherTrade;