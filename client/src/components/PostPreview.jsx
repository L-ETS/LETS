import React from 'react';
import { useNavigate } from 'react-router-dom';

function PostPreview({title, p_state, post, imageUrl, isLoading}) {

  const navigate = useNavigate();

  const handleClick = () => {
    //navigate(`/posts/${postId}`);
  }

  return (
    <div>
      {
        isLoading ? null :
        <div style={{
          display:'flex', 
          justifyContent: 'flex-start',
          cursor: 'pointer',
          border: '1px solid'
        }}
        onClick={handleClick}>
          
          <img src={imageUrl} alt='상품이미지' style={{maxWidth: '100px'}}/>
          
          <div>
            <h4>제목: {title}</h4>
            <span>거래상태: {p_state}</span>
          </div>
          
        </div>
      }
    </div>
  );
};

export default PostPreview;