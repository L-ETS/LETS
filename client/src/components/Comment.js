import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from 'react-router-dom'
import axios from "axios";
import '../styles/reply.css';
import UserContext from "../contexts/UserContext";
import { response } from "express";

function Comment({comment}) {
  const { commentId } = useParams();  
  const [content, setContent] = useState();
  const navigate = useNavigate();

  const { logginedUserId } = useContext(UserContext); //현재 로그인한 유저의 id

  const getCommentData = async () => {
    try{
      const res = await axios.get(`/comment/${commentId}`);
      const commentContent = res.data.comment.content;
      setContent(commentContent);
    } catch (error) {
      console.log(error);
    }
  }
  
  useEffect(() => {
    getCommentData();
  },[]);

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if(content.length === 0){
      alert('내용을 입력해주세요.')
      return;
    }

    const commentFormData = new FormData();
     commentFormData.append('content',content);
     
     try {
       await axios.put(`/comment/${commentId}/edit`,commentFormData,{
         headers: {
           'Content-Type' : 'multipart/form-data',
          }
    });
    alert('댓글 수정 완료')
    navigate('/');
  } catch(error){
    console.error('서버 요청 오류', error);
  }
};
  
  const handleDelete = async () => {
    try {
      const res = await axios.delete(`/comment/${commentId}`);
  
      if(res.status == 200) {
        alert('댓글 삭제 완료')
      }
      else if (res.status == 404) {
        alert('해당 댓글을 찾을 수 없습니다.');
      }
      navigate('/');
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
            <button className='revise'onClick={handleEditSubmit} style={{borderRadius: '5px'}}>수정</button>
            <button className='delete' onClick={handleDelete}style={{borderRadius: '5px'}}>삭제</button>
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