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
            
            <div className={styles.content}>
                <div style={{fontWeight:700}}>글 제목</div>
                <br></br>
                <div>작성자</div>
                <div>글 내용은~~~ 상위 div 반복으로 붙여넣기!</div>
            </div>

            <div className={styles.content}>
                <div style={{fontWeight:700}}>글 제목</div>
                <br></br>
                <div>작성자</div>
                <div>글 내용은~~~ 상위 div 반복으로 붙여넣기!</div>
            </div>
        </div>
    )
}

function Post({title, author}) {
    return (
        <div className={styles.content}>
            <div style={{fontWeight:700}}>{title}</div>
            <br></br>
            <div>{author}</div>
            <div>글 내용은~~~ 상위 div 반복으로 붙여넣기!</div>
        </div>
    )
}

export default MyPost;