import React, { useEffect, useState, useContext } from "react";
import { addDoc, collection, serverTimestamp, query, onSnapshot, where, orderBy } from 'firebase/firestore'
import { db } from "../config/firebase";
import UserContext from "../contexts/UserContext";
import PostPreview from "../components/PostPreview";
import { useParams } from "react-router-dom";
import axios from "axios";
import Spinner from 'react-bootstrap/Spinner';

 //댓글 채팅 버튼 -> 1대1 채팅 연결
function Chat() { // https://www.youtube.com/watch?v=0gLr-pBIPhI (참고 자료)
    const [newMessage, setNewMessage] = useState(""); // 입력받은 메시지
    const [messageList, setMessageList] = useState([]); // 저장된 메시지 리스트
    const messageRef = collection(db, "messages"); // firebase.js에서 선언해준 db를 가져와서 Cloud Firestore의 'messages/'를 참조
    const { logginedUserId } = useContext(UserContext); //현재 로그인한 유저의 id
    const { uuid } = useParams();
    const [postId, setPostId] = useState('');
    const [postTitle, setPostTitle] = useState('');
    const [postP_state, setPostP_state] = useState('');
    const [isShow, setIsShow] = useState(false);    //해당 페이지 보여줄지 여부를 결정.
    const [isLoading, setisLoding] = useState(true);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newMessage == "") return;
        
        try {
            await addDoc(messageRef, {
                text: newMessage,
                createAt: serverTimestamp(),
                user: logginedUserId,
                room: "room1"
            });
        } catch (error) {
            console.error("Error adding document: ", error);
            alert('에러 발생. 다시 시도해주세요.');
        } finally {
            setNewMessage("");
        }
        
    };

    const chatAuthenticate = async () => {
        try {
            const response = await axios.get(`/chat/authenticate/${logginedUserId}/${uuid}`);
            const exist = response.data.exist;

            if(exist) setIsShow(true);
            else setIsShow(false);
        } catch (error) {
            setIsShow(false);
            console.log(error);
            alert('인증오류');
        }
    }

    const fetchPostData = async () => {
        try {
            const response = await axios.get(`/posts/uuid/${uuid}`);
            const postData = response.data.post;
            setPostId(postData.postId);
            setPostTitle(postData.title);
            setPostP_state(postData.p_state);
        } catch (error) {
            console.log(error);
            alert('에러 발생. 다시 시도해주세요.');
        } finally {
            setisLoding(false);
        }
    }

   // a b = db / test001, test002 | test001t, est002 ==> / {uuid/uid1/uid2} / chatlist q == b
   //chat btn -> {uid1/uid2} / o -> con / x -> uuid create
    useEffect(() => {
        chatAuthenticate();
        fetchPostData();
        
        // 쿼리를 여러가지 조건으로 검색하기 위해서는 복합색인에 추가해야함
        const queryMessage = query(messageRef, where("room", "==", "room1"), orderBy("createAt", "asc"));
        onSnapshot(queryMessage, (snapshot) => {
            let messages = [];
            snapshot.forEach((doc) => {
                messages.push({...doc.data(), id: doc.id});
            });
            //console.log(messages);
            setMessageList(messages);
        });
    }, []);
    if(isShow && !isLoading) 
        return(
            <div style={{
                margin: "0 10%",
                height: '80vh'
            }}>
                <PostPreview title={postTitle} p_state={postP_state} postId={postId}/>
                <div style={{
                    overflow: 'auto', top: '0', 
                    height:"100%", 
                    backgroundColor: "skyblue"
                }}>
                    {messageList.map((msg, idx) => (
                        <p key={idx}>{msg.user} : {msg.text}</p>
                    ))}
                </div>
                <form onSubmit={handleSubmit} style={{display: "flex"}}>
                    <input onChange={(e) => setNewMessage(e.target.value)} value={newMessage}/>
                    <button type="submit" style={{whiteSpace:"nowrap"}}>전송</button>
                </form>
                
            </div>
        )
    else {
        return (
            <div style={{display: "flex", justifyContent: "center", alignContent: "center"}}>
                <Spinner animation="border" />
            </div>
        )
    }
    
}

export default Chat;