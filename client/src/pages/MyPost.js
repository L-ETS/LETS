import React from "react";
import Button from 'react-bootstrap/Button';
import styles from '../styles/MyPost.module.css'; 


function MyPost() {

    return (
        <div className={styles.container}>
            <div className={styles.postStatus}>
                <Button variant="outline-success">전체 글</Button>{' '}
                <Button variant="outline-success">거래 대기</Button>{' '}
                <Button variant="outline-success">거래중</Button>{' '}
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

export default MyPost;