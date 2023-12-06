import react, { useEffect, useState } from "react";
import axios from "axios";
import styles from '../styles/BookMark.module.css';
import { useNavigate } from "react-router-dom";

function BookMark() {
    const navigate = useNavigate();
    const [likeposts, SetLikeposts] = useState([]);

    useEffect(() => {
      axios.get('/user/getlikeposts')
      .then(response => {
        //console.log(response.data.postData);
        SetLikeposts(response.data.postData);
      })
      .catch((error) => {
        console.error('데이터 가져오기 오류:', error);
      })
    }, []);
//onClick={navigate(`/posts/${post.postId}`)}
    return (
        <div>
        {likeposts.map((post, index) => (
            <div className={styles.content} key={index}>
                <div style={{fontWeight:700}}>{post.title}</div><br/>
                <div>{post.nickname}</div>
                <div>{post.content}</div>
            </div>
        ))}
        </div>
    )
}

export default BookMark;