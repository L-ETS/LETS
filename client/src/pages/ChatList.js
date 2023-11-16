import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import UserContext from "../contexts/UserContext";

function ChatList() {
  const { logginedUserId } = useContext(UserContext); //현재 로그인한 유저의 id
  const [roomuuid, setRoomuuid] = useState([]);

  useEffect(() => {
    if (logginedUserId !== null) {
      axios.get(`/${logginedUserId}/getChatlist`)
        .then(res => {
            console.log("유저는 ", logginedUserId);
            //console.log("chatlist: ", res.data);
            //console.log(res.data.chatList);
            let myChatList = res.data.chatList;
            myChatList.map((myRoomuuid, index) => {
                roomuuid.push(myRoomuuid.uuid);
            });
        })
        .catch((error) => {
            console.error('데이터 가져오기 오류:', error);
        })
    }
  },[logginedUserId]);

  return (
    <div>
      <h1>챗 리스트</h1>
      {
        roomuuid.map((value, key) => <div>{value}</div>) // 이미지 1번(포스트), 마지막 채팅 내용이랑 시간(파이어베이스), 유저 이름(챗룸)
      }
    </div>
  )
}

export default ChatList;
