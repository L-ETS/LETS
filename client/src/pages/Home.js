import Login from "./Login";
import Barter from "./Barter";
import React, { useState, useEffect } from "react";
import axios from "axios";

function Home() {
  //로그인이 되었는지 여부를 나타냄.
  const [isLogin, setIsLogin] = useState(false);

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
      .catch(error=>{console.log(error)})
      
  }, []);

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