import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function PostDetail() {
  const { postId } = useParams();

  const [post, setPost] = useState({});
  const [images, setImages] = useState([]);
  
  useEffect(() => {
    axios.get(`/posts/${postId}`)
      .then(response => {

        setImages(response.data.images);
        setPost(response.data.post);
        
      })
      .catch(error => {
        alert(error);
        console.log(error);
      })
  }, [postId]);
  

  return (
    <div>    
        <h2>{post.title}</h2>
        {
          images.map((image, index)=>{
            return (
              <div key={index}>
                <img src={image.imageUrl} />
              </div>
            )
          })
        }
        <div>
          {post.content}
        </div>
    </div>
  )
}

export default PostDetail;