import React from 'react';
import { useNavigate } from 'react-router-dom';

function PostPreview({title, p_state, postId}) {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/posts/${postId}`);
  }

  return (
    <div style={{
      display:'flex', 
      justifyContent: 'flex-start',
      cursor: 'pointer',
      border: '1px solid'
    }}
    onClick={handleClick}>
      
      <img src='https://img.hankyung.com/photo/202309/01.34468740.1.jpg' alt='상품이미지' style={{maxWidth: '100px'}}/>
      
      <div>
        <h4>제목: {title}</h4>
        <p>거래상태: {p_state}</p>
      </div>
      
    </div>
  );
};

export default PostPreview;