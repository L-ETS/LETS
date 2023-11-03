import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function CommentEdit({comment}) {

  const { postId } = useParams();
  const [commentContent, setCommentContent] = useState(comment.content);
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();
  
  const handleEdit = async () => {
    const { commentId } = comment;
    
    if(commentContent.length === 0) {
      alert('내용을 입력하세요')
      return;
    }

    try{
      const response = await axios.put(`/comment/update`, { 
        data: {
          content: commentContent,
          commentId: commentId
        }
      });

      const updatedComment = response.data.comments;

    setComments((prevComments) =>
      prevComments.map((prevComment) =>
        prevComment.commentId === updatedComment.commentId
          ? { ...prevComment, content: updatedComment.content }
          : prevComment
      )
    );
      alert('댓글 수정 완료')
      console.log(response.data);
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