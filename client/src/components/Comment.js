import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from 'react-router-dom'
import axios from "axios";
import '../styles/reply.css';
import UserContext from "../contexts/UserContext";
import { response } from "express";

function Comment({comment}) {
  const navigate = useNavigate();
  const { commentId, postId } = useParams();  
  const [commentContent, setCommentContent] = useState('');
  const [comments, setComments] = useState([]);
  const { logginedUserId } = useContext(UserContext); //현재 로그인한 유저의 id

  const handleEdit = async (e) => {
    setCommentContent(e.target.value);
     try {
       const response = await axios.put(`/comment/edit`,{
        postId: postId,
        userId: logginedUserId,
        content: commentContent
    });
    const comment = response.data.comment;

    if(!comment) throw new Error('서버에서 댓글 가져오기 실패');
    setComments(prev => [...prev, comment]);
    alert('댓글 수정 완료');
    setCommentContent('');
  } catch(error){
    console.error('서버 요청 오류', error);
  }
};
  
  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete(`/comment/delete`,{
        commentId: commentId
      });
      const comment = response.data.comment;
      if (!comment) throw new Error('댓글 가져오기 실패');
      setComments(prev => [...prev, comment]);      
      alert('삭제 실패');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='reply'>
      <div>
        <div className='writer'>{comment.userId}</div>
        {
          comment.userId === logginedUserId ? //comment.userId는 댓글 작성자의 id
          <div>
            <button className='edit'onClick={handleEdit} style={{borderRadius: '5px'}}>수정</button>
            <button className='delete'onClick={handleDelete} style={{borderRadius: '5px'}}>삭제</button>
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