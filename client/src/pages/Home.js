import Login from "./Login";
import Barter from "./Barter";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Spinner from 'react-bootstrap/Spinner';

function Home() {
  
  const [isLogin, setIsLogin] = useState(false); //로그인이 되었는지 여부를 나타냄.
  const [loading, setLoading] = useState(true); //로딩중인지 나타냄.(비동기적 성격 때문에 데이터를 불러오기도 전에 렌더링 해버리는 문제를 해결하기 위함.)

  useEffect(() => {
    // Check if the user is logged in when the component mounts
    axios.get('/api/check-session')
      .then(response => {
        if (response.data.loggedIn) {
          setIsLogin(true);
        }
        else {
          setIsLogin(false);
        }
      })
      .catch(error=>{console.error("Error checking login status:", error);})
      .finally(()=>{setLoading(false)})
  }, []);

  if(loading) {
    return (
      <div style={{display: "flex", justifyContent: "center", alignContent: "center"}}>
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <>
      {
        //로그인 여부에 따라 로그인 페이지를 보여줄지, 메인페이지를 보여줄지 결정.
        isLogin ? <Barter setIsLogin={setIsLogin}/> : <Login setIsLogin={setIsLogin}/>
      }
    </>
  )
}

export default Home;