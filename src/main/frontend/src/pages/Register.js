import { useState } from 'react';

//해당 페이지에 적용될 css파일(chat gpt 복붙 한건데 만들 때 방해되면 지우셔도 됩니다.)
import '../styles/registerPage.css'

function Register() {
  const [email, setEmail] = useState('');

  //회원가입 버튼 눌렀을 때 벌어질 이벤트
  const handleSubmit = (e) => {
    e.preventDefault();

    
  };

  return (
    <div className="register-page">
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>

        <div className="input-group">
          {/* 아이디 입력 ui */}
        </div>

        <div className="input-group">
          {/* 비밀번호 입력 ui */}
        </div>

        <div className="input-group">
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          {/* 닉네임 입력 ui */}
        </div>

        <div className="input-group">
          {/* 지역 입력 ui */}
        </div>
        
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
}

export default Register;
