import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import '../styles/reply.css';
import UserContext from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';  
import Button from 'react-bootstrap/Button';

function Comment({comment, comments, setComments}) {
  const [commentContent, setCommentContent] = useState('');  
  const [showAlert, setShowAlert] = useState(false);
  const { logginedUserId } = useContext(UserContext); //현재 로그인한 유저의 id
  const navigate = useNavigate();

  const handleEdit = async (e) => {
  //   setCommentContent(e.target.value);
  //    try {
  //      const response = await axios.put(`/comment/edit`,{
  //       postId: postId,
  //       userId: logginedUserId,
  //       content: commentContent
  //   });
  //   const comment = response.data.comment;

  //   if(!comment) throw new Error('서버에서 댓글 가져오기 실패');
  //   setComments(prev => [...prev, comment]);
  //   alert('댓글 수정 완료');
  //   setCommentContent('');
  // } catch(error){
  //   console.error('서버 요청 오류', error);
  // }
};
  
  const handleDelete = async () => {
    
    try {
      const response = await axios.delete(`/comment/delete`,{
        data: {
          commentId: comment.commentId
        }
      });
      const updatedComments = comments.filter(c => c.commentId !== comment.commentId);
      setComments(updatedComments);
      alert('댓글을 삭제했습니다.');
      
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='reply'>
      <Modal show={showAlert} onHide={()=>{setShowAlert(false)}}>
        <Modal.Header closeButton>
          <Modal.Title>정말로 삭제하시겠습니까?</Modal.Title>
        </Modal.Header>
        <Modal.Body>삭제 후 복구할 수 없습니다.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>{setShowAlert(false)}}>
            취소
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            삭제
          </Button>
        </Modal.Footer>
      </Modal>
      <div>
        <div className='writer'>{comment.userId}</div>
        {
          comment.userId === logginedUserId ? //comment.userId는 댓글 작성자의 id
          <div>
            <button className='edit'onClick={handleEdit} style={{borderRadius: '5px'}}>수정</button>
            <button className='delete'onClick={()=>setShowAlert(true)} style={{borderRadius: '5px'}}>삭제</button>
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