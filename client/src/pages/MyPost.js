import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import styles from '../styles/MyPost.module.css'; 
import axios from "axios";

function MyPost() {
    const beforeTrade = '거래 가능';
    const tradeComplete = '거래 완료';
    const [postList, setPostList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPosts = async (p_state) => {
        
        try {
            const response = await axios.get(`/postList/${p_state}`);
            
            if(response.status === 200) {
                setPostList(response.data.postData);
            }
            
        } catch (error) {
            alert('글을 불러오는데 실패했어요');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.postStatus}>
                <Button variant="outline-success">전체 글</Button>{' '}
                <Button variant="outline-success" onClick={()=>fetchPosts(beforeTrade)}>거래 가능</Button>{' '}
                <Button variant="outline-success" onClick={()=>fetchPosts(tradeComplete)}>거래 완료</Button>{' '}  
            </div>
            {
                postList.map(post => <Post title={post.title} author={post.userId} key={post.postId}/>)
            }
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