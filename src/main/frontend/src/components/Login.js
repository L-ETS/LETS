import { useState } from "react";

//해당 페이지에 적용될 css파일(chat gpt 복붙 한건데 만들 때 방해되면 지우셔도 됩니다.)
import '../styles/loginPage.css'; 

function Login() {
  
  const [userId, setUserId] = useState('');

  //로그인 버튼 눌렀을 때 벌어질 이벤트
  const handleSubmit = (e) => {
    e.preventDefault();

   
  };

  return (
    <div className="login-page">
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="userId">아이디</label>
          <input
            type="text"
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          {/* 비밀번호 입력 ui */}
        </div>
        {/* 로그인 버튼 ui */}
        {/* 회원가입 버튼 ui */}
      </form>
    </div>
  );
}

export default Login;