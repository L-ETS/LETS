import React, { useState } from 'react';

//해당 페이지에 적용될 css파일(chat gpt 복붙 한건데 만들 때 방해되면 지우셔도 됩니다.)
import '../styles/registerPage.css'

function Register() {
  const [email, setEmail] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [emailValid, setEmailVaild] = useState(false);

  //이메일 유효성 검사
  function isValidEmail(email) {
    const emailRegex = /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/
    if(emailRegex.test(email)) {
      setEmailVaild(true)
      return true
    }
    else {
      setEmailVaild(false)
      return false
    }
  }

  //이메일 입력칸 밑에 메시지 출력
  const handleEmailChange = (e) => {
    if(!e.target.value) {
      setEmailMessage('이메일을 입력해주세요.')
    }
    else if(!isValidEmail(e.target.value)) {
      setEmailMessage('이메일 형식으로 작성해주세요.')
    }
    else {
      setEmailMessage('사용 가능한 이메일입니다.')
    }
  }

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
            onBlur={handleEmailChange}
            maxLength={30}
            required
          />
        </div>
        <p>{emailMessage}</p>

        <div className="input-group">
          {/* 닉네임 입력 ui */}
        </div>

        <div className="input-group">
          <label for="reg">Region</label>
              <select name="region" id="reg">
                  <option value="seoul">서울</option>
              <optgroup label="경기">
                  <option value="yongin">용인</option>
                  <option value="suwon">수원</option>
              </optgroup>
                  <option value="busan">부산</option>
                  <option value="gwangju">광주</option>
                  <option value="jeju">제주</option>
              </select>
        </div>
        
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
}

export default Register;
