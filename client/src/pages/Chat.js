import React, { useEffect, useState, useContext } from "react";
import { addDoc, collection, serverTimestamp, query, onSnapshot, where, orderBy } from 'firebase/firestore'
import { db } from "../config/firebase";
import UserContext from "../contexts/UserContext";

function Chat() { // https://www.youtube.com/watch?v=0gLr-pBIPhI (참고 자료)
    const [newMessage, setNewMessage] = useState(""); // 입력받은 메시지
    const [messageList, setMessageList] = useState([]); // 저장된 메시지 리스트
    const messageRef = collection(db, "messages"); // firebase.js에서 선언해준 db를 가져와서 Cloud Firestore의 'messages/'를 참조
    const { logginedUserId } = useContext(UserContext); //현재 로그인한 유저의 id

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newMessage == "") return;

        await addDoc(messageRef, {
            text: newMessage,
            createAt: serverTimestamp(),
            user: logginedUserId,
            room: "room1"
        });
        
        setNewMessage("");
    };

    useEffect(() => {
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

    return(
        <div>
            <form onSubmit={handleSubmit}>
                <input onChange={(e) => setNewMessage(e.target.value)} value={newMessage}/>
                <button type="submit">Send</button>
            </form>
            <div>
                {messageList.map((msg) => (
                    <h2>{msg.user} : {msg.text}</h2>
                ))}
            </div>
        </div>
    )
}

export default Chat;