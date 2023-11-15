import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from 'react-router-dom'
import axios from "axios";
import '../styles/reply.css';
import UserContext from "../contexts/UserContext";

function Comment({comment, post}) {
  const navigate = useNavigate();
  const { commentId } = useParams();  
  const [commentContent, setCommentContent] = useState('');
  const [comments, setComments] = useState([]);
  const [showChatBtn, setShowChatBtn] = useState(false);
  const { logginedUserId } = useContext(UserContext); //현재 로그인한 유저의 id

  useEffect(()=>{
    if (logginedUserId === post.userId) {
      setShowChatBtn(true);
    }
  },[])

  const handleEdit = async (e) => {
    setCommentContent(e.target.value);
     try {
       const response = await axios.put(`/comment/edit`,{
        postId: post.postId,
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

  //채팅방으로 이동.
  const handleChat = async () => {
    let user1, user2;
  
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
      const { message, room_uuid } = response.data;
      
      if (message === 'Room created' || message === 'Room already exists') {
        // Assuming `navigate` is a function to navigate to a new page
        navigate(`/chat/${room_uuid}`);
      } else {
        throw new Error('Unexpected response from the server.');
      }
    } catch (error) {
      alert('문제가 발생했습니다. 다시 시도해주세요.');
      console.error(error);
    }
  };
  

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
          :
          showChatBtn ? <button onClick={handleChat} style={{borderRadius: '5px'}}>채팅</button> : null
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