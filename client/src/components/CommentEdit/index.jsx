import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function CommentEdit({comment}) {

  const { postId } = useParams();
  const [commentContent, setCommentContent] = useState('')
  const navigate = useNavigate();
  
  useEffect(() => {
    setCommentContent(comment.content);
  },[comment.content]);
  
  const handleEdit = async (e) => {
    e.preventDefault();
    
    const { commentId } = comment;
    
    if(commentContent.length === 0) {
      alert('내용을 입력하세요')
      return;
    }

    try{
      const response = await axios.put(`/comment/${commentId}`, {content: commentContent})

      alert('댓글 수정 완료')
      console.log(response.data);
      navigate(`/posts/${postId}`);
    } catch (error) {
      console.error(error)
    }
  }

  return (
  <form>  
    <div className='wrapper'>
      <textarea 
        placeholder={comment.content}
        value={commentContent}
        onChange={(e)=>setCommentContent(e.target.value)}
        ></textarea>
        <button className='confirm' onClick={handleEdit}
        style={{borderRadius: '10px'}}>수정</button>
    </div>
  </form>
    )
  }

export default CommentEdit