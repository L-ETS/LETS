import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function PostDetail() {
  const { postId } = useParams();

  const [post, setPost] = useState({});
  const [images, setImages] = useState([]);
  const [mainImageSrc, setMainImageSrc] = useState('');
  
  useEffect(() => {
    axios.get(`/posts/${postId}`)
      .then(response => {

        setImages(response.data.images);
        setPost(response.data.post);
        setMainImageSrc(response.data.images[0].imageUrl)
      })
      .catch(error => {
        alert(error);
        console.log(error);
      })
  }, [postId]);
  

  return (
    <div>
      <h2>{post.title}</h2>
      <div style={{width: '410px', height: '410px'}}>
        <img style={{height: '410px'}} src={mainImageSrc} alt="Main Preview" fluid />
      </div>
        {
          images.map((image, index)=>{
            return (

              <div key={index} style={{display:"inline-block"}}>
                <img  width='40px' src={image.imageUrl} onMouseEnter={() => setMainImageSrc(image.imageUrl)}/>
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