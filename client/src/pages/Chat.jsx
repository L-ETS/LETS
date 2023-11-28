import React, { useEffect, useState, useContext } from "react";
import { addDoc, collection, serverTimestamp, query, onSnapshot, where, orderBy } from 'firebase/firestore'
import { db } from "../config/firebase";
import UserContext from "../contexts/UserContext";
import PostPreview from "../components/PostPreview";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Spinner from 'react-bootstrap/Spinner';
import '../styles/Chat.modules.css';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Modal from 'react-bootstrap/Modal';  
import Button from 'react-bootstrap/Button';

 //댓글 채팅 버튼 -> 1대1 채팅 연결
function Chat() { // https://www.youtube.com/watch?v=0gLr-pBIPhI (참고 자료)
    const [newMessage, setNewMessage] = useState(""); // 입력받은 메시지
    const [messageList, setMessageList] = useState([]); // 저장된 메시지 리스트
    const messageRef = collection(db, "messages"); // firebase.js에서 선언해준 db를 가져와서 Cloud Firestore의 'messages/'를 참조
    const { logginedUserId } = useContext(UserContext); //현재 로그인한 유저의 id
    const { room_uuid } = useParams();
    const [postId, setPostId] = useState('');
    const [postTitle, setPostTitle] = useState('');
    const [postP_state, setPostP_state] = useState('');
    const [postUserId ,setPostUserId] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [opponentUserId, setOpponentUserId] = useState('');
    const [isShow, setIsShow] = useState(true);    //해당 페이지 보여줄지 여부를 결정.
    const [isLoading, setisLoding] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newMessage === "") return;
        
        try {
            await addDoc(messageRef, {
                text: newMessage,
                createAt: serverTimestamp(),
                user: logginedUserId,
                room: room_uuid
            });
            setNewMessage("");
        } catch (error) {
            console.error("Error adding document: ", error);
            alert('에러 발생. 다시 시도해주세요.');
        }
    }

    const chatAuthenticate = async () => {
        try {
            const response = await axios.get(`/chat/authenticate/${logginedUserId}/${room_uuid}`);
            const exist = response.data.exist;
            console.log(response.data.oUserId);
            setOpponentUserId(response.data.oUserId);
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
            const response = await axios.get(`/posts/uuid/${room_uuid}`);
            const postData = response.data.post;
            setPostId(postData.postId);
            setPostTitle(postData.title);
            setPostP_state(postData.p_state === "NULL" ? "거래 가능" : "거래 완료");
            setPostUserId(postData.userId);
        } catch (error) {
            console.log(error);
            alert('에러 발생. 다시 시도해주세요.');
        }
    }

    const fetchImage = async () => {
        if(postId) {
            try {
                const response = await axios.get(`/image/${postId}`);
                setImageUrl(response.data.imageUrl);
            } catch (error) {
                console.log(error);
                alert('에러 발생. 다시 시도해주세요.');
            } finally {
                setisLoding(false);
            } 
        }
    }

    const handlePstate = async (eventKey) => {
    
        try {
          const response = await axios.put(`/post/edit/pstate`, {
            postId: postId,
            p_state: eventKey
          });
          setPostP_state(eventKey === "NULL" ? "거래 가능" : "거래 완료");
          
        } catch (error) {
          alert('거래 상태 바꾸기에 실패했습니다.');
          console.log(error);
        }
    }

   // a b = db / test001, test002 | test001t, est002 ==> / {uuid/uid1/uid2} / chatlist q == b
   //chat btn -> {uid1/uid2} / o -> con / x -> uuid create
    useEffect(() => {
        chatAuthenticate();
        fetchPostData();
        // fetchImage();
        const queryMessage = query(messageRef, where("room", "==", room_uuid), orderBy("createAt", "asc"));     
        onSnapshot(queryMessage, (snapshot) => {
            let messages = [];
            snapshot.forEach((doc) => {
                messages.push({...doc.data(), id: doc.id});
            });
            //console.log(messages);
            setMessageList(messages);
        });
        // 쿼리를 여러가지 조건으로 검색하기 위해서는 복합색인에 추가해야함
    },[]);

    useEffect(() => {
        fetchImage();
    }, [postId])

    if(isShow && !isLoading)
        return(
    <div className="message">
                <PostPreview title={postTitle} p_state={postP_state} postId={postId} imageUrl={imageUrl} isLoading={isLoading}/>
    {logginedUserId !== opponentUserId ?
    <div>
                <Modal show={showAlert} onHide={()=>{setShowAlert(false)}}>
                    <Modal.Header>
                        <Modal.Title>거래를 완료하겠습니까?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>교환이 성사되었다면 완료 버튼을 눌러주세요!<br />이후 거래가 종료됩니다.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={()=>setShowAlert(false)}>취소</Button>
                        <Button onClick={() => {
                            handlePstate(opponentUserId);
                            setShowAlert(false);
                            alert('수고하셨습니다,, 행복하세요');
                            navigate('/');
                        }}>거래 완료!</Button>
                    </Modal.Footer>
                </Modal>
                <DropdownButton id="dropdown-basic-button" title={postP_state} variant="success" onSelect={(eventKey) => handlePstate(eventKey)}>
                  <Dropdown.Item eventKey="NULL">거래 가능</Dropdown.Item>
                  <Dropdown.Item eventKey="NULL" onClick={()=>setShowAlert(true)}>거래 완료</Dropdown.Item>
                </DropdownButton>
                    <DropdownButton id="dropdown-basic-button" title={postP_state} variant="success" onSelect={(eventKey) => handlePstate(eventKey)}>
                    <Dropdown.Item eventKey="NULL">거래 가능</Dropdown.Item>
                    <Dropdown.Item eventKey={opponentUserId}>거래 완료</Dropdown.Item>
                    </DropdownButton>
                </div>
                :
                null
                }
                <main>
                    {messageList.map((msg,idx) => (
                        <div key={idx} className={`messageList ${msg.user === logginedUserId ? 'sent' : 'received'}`}>
                            <p>{msg.user} : {msg.text}</p>
                        </div>
                        ))}
                </main>
                <form onSubmit={handleSubmit}>
                    <input onChange={(e) => setNewMessage(e.target.value)} value={newMessage}/>
                    <button type="submit">전송</button>
                </form>
                
            </div>
        )
    else {
        return (
            <div>
                <Spinner animation="border" />
            </div>
        )
    }
}

export default Chat;