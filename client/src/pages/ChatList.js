import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import UserContext from "../contexts/UserContext";

function ChatList() {
  const { logginedUserId } = useContext(UserContext); //현재 로그인한 유저의 id
  const user = logginedUserId;
  const [roomuuid, setRoomuuid] = useState([]);

  useEffect(() => {
    if (user == null) return; // 이부분이 없으면 null값이 한 번 출력됨
    axios.get(`/${user}/getChatlist`)
      .then(res => {
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
  }, [user]);

  return (
    <div>
      <h1>챗 리스트</h1>
    </div>
  )
}

export default ChatList;
