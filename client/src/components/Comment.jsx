import React, { useState, useContext } from "react";
import axios from "axios";
import '../styles/reply.css';
import UserContext from "../contexts/UserContext";
import Modal from 'react-bootstrap/Modal';  
import Button from 'react-bootstrap/Button';

function Comment({comment, comments, setComments}) {
  const [commentContent, setCommentContent] = useState('');  
  const [showAlert, setShowAlert] = useState(false);
  const [showModifyUi, setShowModifyUi] = useState(false);
  const { logginedUserId } = useContext(UserContext); //현재 로그인한 유저의 id
  
  const handleEdit = async () => {
    try {
      const response = await axios.put('/comment/update', {
        commentId: comment.commentId,
        content: commentContent
      });
      
      setShowModifyUi(false);
      setComments(comments.map(c => c.commentId === comment.commentId ? {...c, content: commentContent} : c));

      alert('수정완료');
    } catch (error) {
      alert('수정 실패.');
    }
  }

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
          showModifyUi ?
          null
          :
          <div>
            {
              comment.userId === logginedUserId ? //comment.userId는 댓글 작성자의 id
              <div>
                <button className='edit'onClick={()=>{
                  setShowModifyUi(true);
                  setCommentContent(comment.content);
                }} style={{borderRadius: '5px'}}>수정</button>
                <button className='delete'onClick={()=>setShowAlert(true)} style={{borderRadius: '5px'}}>삭제</button>
              </div>
              : null
            } 
          </div>
        }
        
      </div>          
      {
        showModifyUi ?
        <div style={{display: 'flex'}}>
          <input type="text" value={commentContent} onChange={(e)=>{setCommentContent(e.target.value)}}/>
          <button style={{whiteSpace: 'nowrap'}} onClick={handleEdit}>등록</button>
          <button style={{whiteSpace: 'nowrap'}} onClick={()=>setShowModifyUi(false)}>취소</button>
        </div>
        :
        <div className='content'>
          {comment.content}
        </div>
      }
    </div> 
  )
}

export default Comment;