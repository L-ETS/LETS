import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from "axios";
import '../styles/reply.css';
import UserContext from "../contexts/UserContext";
import CommentEdit from "./CommentEdit";

function Comment({comment}) {
  const navigate = useNavigate();
  const { commentId, postId } = useParams();  
  const [commentContent, setCommentContent] = useState('');
  const [comments, setComments] = useState([]);
  const { logginedUserId } = useContext(UserContext); //현재 로그인한 유저의 id

  const handleDelete = async () => {
    try {
      const response = axios.delete(`/posts/${postId}/comment`);
      if(response.status === 200) {
        alert('댓글을 삭제했습니다')
        window.location.reload();
      } else if(response.status === 404) {
        alert('댓글을 찾을 수 없습니다')
      }
      } catch (error) {
        console.log(error)
      }
    }
    
    return (
    <div className='reply'>
      <div>
        <div className='writer'>{comment.userId}</div>
        {
          comment.userId === logginedUserId ? //comment.userId는 댓글 작성자의 id
          <div>
            <button onClick={() => <CommentEdit />} className='edit' style={{borderRadius: '5px'}}>수정</button>
            <button className='delete' onClick={handleDelete} style={{borderRadius: '5px'}}>삭제</button>
          </div>
          : null
        }        
      </div>
      <br></br>
      <div className='content'>
        {comment.content}
      </div>
    </div> 
  )
}


export default Comment;