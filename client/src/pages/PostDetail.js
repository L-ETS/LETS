import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function PostDetail() {
  const { postId } = useParams();

  const [post, setPost] = useState({});
  const [images, setImages] = useState([]);
  const [mainImageSrc, setMainImageSrc] = useState('');

  const create = new Date(post.create_date);
  const update = new Date(post.update_date);

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
      <div style={{margin: '10px 0', borderBottom: '1px solid'}}>
        {
          create < update ?
          <div>
            <span>수정일: {update.getFullYear()}년 {update.getMonth()+1}월 {update.getDate()}일</span>
            <br/>
            <span>작성자: {post.userId}</span>
          </div>
          :
          <div>
            <span>작성일: {create.getFullYear()}년 {create.getMonth()+1}월 {create.getDate()}일</span>
            <br/>
            <span>작성자: {post.userId}</span>
          </div>
        }
      </div>
      
      <p>
        {post.content}
      </p>
    
    </div>
  )
}

export default PostDetail;