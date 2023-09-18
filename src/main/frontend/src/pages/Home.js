import Login from "../components/Login"
import Barter from "./Barter";
import { useState } from "react"

function Home() {
  //로그인이 되었는지 여부를 나타냄.
  const [isLogin, setIsLogin] = useState(false);

  return (
    <>
      {
        //로그인 여부에 따라 로그인 페이지를 보여줄지, 메인페이지를 보여줄지 결정.
        isLogin ? <Barter/> : <Login/>
      }
    </>
  )
}

export default Home;