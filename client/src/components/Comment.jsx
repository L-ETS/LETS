import React, { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import styles from '../styles/reply.module.css';
import UserContext from "../contexts/UserContext";
import Modal from 'react-bootstrap/Modal';  
import Button from 'react-bootstrap/Button';

function Comment({comment, comments, setComments, post}) {
  const navigate = useNavigate();
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

  const handleChat = async () => {
    let user1, user2;
    //console.log("ppid: ", post.postId);
    if (logginedUserId < comment.userId) {
      user1 = logginedUserId;
      user2 = comment.userId;
    } else {
      user1 = comment.userId;
      user2 = logginedUserId;
    }
  
    if (!user1 || !user2) throw new Error('user1 또는 user2 정보 없음.');
  
    try {
      const response = await axios.post(`/chat/${user1}/${user2}/${post.postId}`);
      const { message, UUID } = response.data;
      console.log("uuid: ", UUID);
      if (message === 'Room already exists') {
        console.log(response.data.UUID);
        navigate(`/chat/${UUID}`);
      } else if (message === 'Room created') {
        console.log('room created',response.data.UUID);
        alert('Room created');
      } else {
        throw new Error('Unexpected response from the server.');
      }
    } catch(error) {
      console.error('Error creating chat:', error);
    }
  };

  return (
    <div className={styles.reply}>
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
        <div className={styles.writer}>{comment.nickname}</div>
        {
          showModifyUi ?
          null
          :
          <div>
            {
              comment.userId === logginedUserId ? //comment.userId는 댓글 작성자의 id
              <div>
                <button className={styles.revise}onClick={()=>{
                  setShowModifyUi(true);
                  setCommentContent(comment.content);
                }} style={{borderRadius: '5px'}}>수정</button>
                <button className={styles.delete} onClick={()=>setShowAlert(true)} style={{borderRadius: '5px'}}>삭제</button>
              </div>
              :
                <div>
                {
                post.userId === logginedUserId ?
                <button onClick={handleChat} style={{borderRadius: '5px'}}>채팅</button>
                :
                null
                }
                </div>
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
        <div className={styles.content}>
          {comment.content}
        </div>
      }
    </div> 
  )
}

export default Comment;