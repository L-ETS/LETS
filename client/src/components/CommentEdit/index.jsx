import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Form from 'react-bootstrap/Form';

function CommentEdit() {

  const { commentId, postId } = useParams;
  const {comments, setComments} = useState([]);
  const navigate = useNavigate();
  const [commentContent, setCommentContent] = useState({
      content:''
  })

  useEffect(() => {
    axios.get(`/post/${postId}/comment`)
    .then(res => {
        console.log(res)
        setComments({...commentContent, content: res.data[0].content});
    })
    .catch(err => console.log(err))
  },[])

  const handleEdit = async (e) => {
    e.preventDefault();
    try{
      const response = axios.put(`/posts/${postId}/comment`, commentContent)
      if(response.status === 200) {
        alert('댓글 수정 성공')
      } else if (response.status === 404) {
        alert('댓글 수정 실패')
      }
      navigate(`/posts/${postId}`);
    } catch (error) {
      console.log(error)
    }
  }

  return (
  <form>  
    <div className='wrapper'>
          <textarea 
            placeholder={commentContent.content}
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