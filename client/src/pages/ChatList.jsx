import axios from "axios";
import React, { useEffect, useState } from "react";
import { collection, query, onSnapshot, where, orderBy } from 'firebase/firestore'
import { db } from "../config/firebase";
import { useNavigate } from "react-router-dom";

// 채팅 목록 내 거래 상태 추가

function ChatList() {
  const [myRoomuuid, setMyRoomuuid] = useState([]);
  const [myImageList, setMyImageList] = useState([]);
  const [myPostIdList, setMyPostIdList] = useState([]);
  const [userIdList, setuserIdList] = useState([]);
  const [nicknameList, setNicknameList] = useState([]);
  const [pstateList, setPstateList] = useState([]);
  const [messageList, setMessageList] = useState([]); // 저장된 메시지 리스트
  const messageRef = collection(db, "messages"); // firebase.js에서 선언해준 db를 가져와서 Cloud Firestore의 'messages/'를 참조
  const currentTimeInSeconds = Math.floor(Date.now() / 1000); // 현재 시간 초
  const navigate = useNavigate();

  function getTimeDifference(messageTime, currentTime) { // [마지막으로 보낸 메시지 시간]과 [현재 시간]을 비교하는 함수
    if (messageTime === 0) return '지금 바로 채팅해볼까요?';
    const timeDifference = currentTime - messageTime.seconds;
  
    if (timeDifference < 60) {
      return `${timeDifference} 초 전`;
    } else if (timeDifference < 3600) {
      const minutes = Math.floor(timeDifference / 60);
      return `${minutes} 분 전`;
    } else if (timeDifference < 86400) {
      const hours = Math.floor(timeDifference / 3600);
      return `${hours} 시간 전`;
    } else {
      const days = Math.floor(timeDifference / 86400);
      return `${days} 일 전`;
    }
  }
  
  useEffect(() => {
    axios.get(`/user/getChatlist`)
      .then(res => {
        const myChatList = res.data.chatList;
        myChatList.map((mychat, index) => {
            setMyRoomuuid(prev => [...prev, mychat.uuid]);
        });
      })
      .catch((error) => {
        console.error('데이터 가져오기 오류:', error);
      })
  }, []);

  useEffect(() => {
    if(myRoomuuid.length !== 0) {
      axios.get('/posts/get/uuid', {params : {uuid : myRoomuuid}})
      .then(res => {
        res.data.postIdlist.map((postId, index) => {
          setMyPostIdList(prev => [...prev, postId]);
        });
        res.data.imagelist.map((image, index) => {
          setMyImageList(prev => [...prev, image]);
        });
        res.data.opponentUserIdlist.map((userid, index) => {
          setuserIdList(prev => [...prev, userid]);
        });
        res.data.opponentNicknamelist.map((nickname, index) => {
          setNicknameList(prev => [...prev, nickname]);
        });
        res.data.p_statelist.map((p_state, index) => {
          setPstateList(prev => [...prev, p_state]);
        });

        myRoomuuid.map((ruuid, index) => {
          const queryMessage = query(messageRef, where("room", "==", ruuid), orderBy("createAt", "desc"));
          onSnapshot(queryMessage, (snapshot) => {
            let messages = [];
            snapshot.forEach((doc) => {
              messages.push({...doc.data(), id: doc.id});
            });
            //console.log(messages);
            if(ruuid && messages.length === 0){
              messages.push({
                createAt: 0,
                id: "null",
                room: ruuid,
                text: "아직 채팅이 없어요!",
                user: "null"
              });
            }
            setMessageList(prev => [...prev, messages[0]]);
          });
        });
      })
      .catch((error) => {
        console.error('데이터 가져오기 오류:', error);
      })
    }
  },[myRoomuuid]);

  return (
    <div className="ChatList">
      <div class="row rounded-lg overflow-hidden">
        <div class="bg-white">
          <div class="bg-gray px-4 py-2 bg-light">
            <p class="h5 mb-0 py-1">채팅 목록</p>
          </div>
          {messageList.map((msg, index) => (
          <div class="chat-box" key={index} onClick={() => {navigate(`/chat/${msg.room}/`)}}>
            <div class="list-group rounded-0">
              <a class="list-group-item list-group-item-action list-group-item-light rounded-0">
                <div class="media"><img src={myImageList[index]}
                  alt="Image" width="100" height="100" class="rounded-circle" />
                  <div class="media-body ml-4">
                    <div class="d-flex align-items-center justify-content-between mb-1">
                      <h5 class="mb-0">{nicknameList[index]} {pstateList[index] === 'NULL' ? '거래 가능' : '거래 완료'}</h5>
                      <small class="small font-weight-bold">
                        {getTimeDifference(msg.createAt, currentTimeInSeconds)}
                      </small>
                    </div>
                    <p class="font-italic text-muted mb-0 text-small">{msg.text}</p>
                  </div>
                </div>
              </a>
            </div>
          </div>
          ))}

        </div>
      </div>
    </div>

  );
}

export default ChatList;