import React, { useContext, useState } from 'react'
import axios from 'axios';
import UserContext from '../contexts/UserContext';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

function CommentCreate() {
  
  const { postId, commentId } = useParams();
  const {logginedUserId} = useContext(UserContext);
  const [commentContent, setCommentContent] = useState('');
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

 // 댓글 '등록' 버튼 눌렀을 때 실행할 내용.
 const handleCommentSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const response = await axios.post(`/comment`, {
      postId: postId,
      userId: logginedUserId,
      content: commentContent
    });

    const comment = response.data.comment;

    if (!comment) throw new Error('서버에서 댓글 가져오기 실패');
    setComments(prev => [...prev, comment]);    
    alert('댓글이 작성되었습니다.');
    setCommentContent('');
    
  } catch (error) {
    alert('댓글 작성 실패');
    console.log(error);
  }
}

  return (
    <form onSubmit={handleCommentSubmit}>
    <div className='wrapper'>
      <textarea 
        placeholder='내용을 입력해 주세요.' 
        value={commentContent}
        onChange={(e)=>setCommentContent(e.target.value)}
      ></textarea>
      <button className='confirm' type="submit" style={{borderRadius: '10px'}}>등록</button>
    </div>
  </form>
  )
}

export default CommentCreate