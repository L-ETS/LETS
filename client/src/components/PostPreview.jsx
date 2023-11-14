import React from 'react';

function PostPreview({title, p_state}) {
  return (
    <div style={{display:'flex'}}>
      <p>{p_state}</p>
      <h4>{title}</h4>
    </div>
  );
};

export default PostPreview;