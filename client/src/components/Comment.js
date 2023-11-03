import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import '../styles/reply.css';
import UserContext from "../contexts/UserContext";

function Comment({author}) {
  const { userId } = useContext(UserContext);

  return (
    <div className='reply'>
      <div>
        <div className='writer'>작성자</div>
        {
          author === userId ? 
          <div>
            <button className='revise'style={{borderRadius: '5px'}}>수정</button>
            <button className='delete'style={{borderRadius: '5px'}}>삭제</button>
          </div>
          : null
        }
        
      </div>          
      
      <br></br>
      <div className='content'>
        내용을 작성했습니다~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ
      </div>
    </div> 
  )
}

export default Comment;