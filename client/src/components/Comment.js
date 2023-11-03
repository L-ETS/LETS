import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import '../styles/reply.css';
import UserContext from "../contexts/UserContext";

function Comment({comment}) {
  const { logginedUserId } = useContext(UserContext); //현재 로그인한 유저의 id

  return (
    <div className='reply'>
      <div>
        <div className='writer'>{comment.userId}</div>
        {
          comment.userId === logginedUserId ? //comment.userId는 댓글 작성자의 id
          <div>
            <button className='revise'style={{borderRadius: '5px'}}>수정</button>
            <button className='delete'style={{borderRadius: '5px'}}>삭제</button>
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