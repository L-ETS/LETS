import React, { useState, useContext } from "react";
import { useNavigate, useParams } from 'react-router-dom'
import axios from "axios";
import '../styles/reply.css';
import UserContext from "../contexts/UserContext";
import CommentEdit from "./CommentEdit";

function Comment({comment}) {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);
  const { logginedUserId } = useContext(UserContext); //현재 로그인한 유저의 id
  const [comments, setComments] = useState([]);


const handleDelete = async () => {
  const { commentId } = comment;
  try {
    const response = await axios.delete(`/comment/delete`, {
      data: {
        commentId: commentId,
      }
    });
    
    const deletedComment = response.data.comments;

    if (response.status === 200) {
      setComments(prev => prev.filter(prevComment => prevComment.commentId !== deletedComment.CommentId));
      alert('댓글 삭제 성공');
    } window.location.reload();
  } catch (error) {
    alert('댓글 삭제 실패');
    console.error(error);
  }
};

    const handleEdit = () => {
      setIsEdit((prev) => !prev);
    }
    
    return (
    <div className='reply'>
      <div>
        <div className='writer'>{comment.userId}</div>
        {
          comment.userId === logginedUserId && //comment.userId는 댓글 작성자의 id
          <div>
            <button onClick={handleEdit} className='edit' style={{borderRadius: '5px'}}>수정</button>
            <button className='delete' onClick={handleDelete} style={{borderRadius: '5px'}}>삭제</button>
          </div>
        }        
      </div>
      <br></br>
      <div className='content'>
        {isEdit ? ( <CommentEdit comment={comment} onEditComplete={handleEdit} />) : (comment.content)}
      </div>
    </div> 
  );
}


export default Comment;