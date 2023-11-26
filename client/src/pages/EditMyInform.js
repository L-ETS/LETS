import React, { useState, useContext } from "react";
import Button from 'react-bootstrap/Button';
import styles from '../styles/MyInform.module.css';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import regions from "./regionData";
import UserContext from "../contexts/UserContext";

function EditMyInform({...user}) {
    const { logginedUserId } = useContext(UserContext); //현재 로그인된 유저의 아이디
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');    
    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [wideRegion, setWideRegion] = useState('');
    const [detailRegion, setDetailRegion] = useState('');

    const [passwordError, setPasswordError] = useState('');
    const [passwordCheckError, setPasswordCheckError] = useState('');
    const [nicknameError, setNicknameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [regionError, setRegionError] = useState('');
    const routing =  useNavigate();
    
    const requestData = {
        password: password,
        nickname: nickname,
        email: email,
        wideRegion: wideRegion,
        detailRegion: detailRegion
      };
    
    const goEditMyPage = async (e) => {
    e.preventDefault();

    const passwordRegex = /^[a-zA-Z0-9]{8,20}$/;
    const nicknameRegex = /^[가-힣a-zA-Z]{2,10}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!passwordRegex.test(password)) {
        setPasswordError('올바른 비밀번호 형식이 아닙니다. [대소문자, 숫자로 8 ~ 20자]');
        return;
      } else {
        setPasswordError('');
      }
  
      if (passwordCheck !== password) {
        setPasswordCheckError('비밀번호가 일치하지 않습니다.');
        return;
      } else {
        setPasswordCheckError('');
      }

    if (!nicknameRegex.test(nickname)) {
        setNicknameError('올바른 닉네임 형식이 아닙니다. [한글, 영문 대소문자로 2 ~ 10자]');
        return;
    } else {
        setNicknameError('');
    }
    
    if (!emailRegex.test(email)) {
        setEmailError('올바른 이메일 형식이 아닙니다. [example@example.com]');
        return;
    } else {
        setEmailError('');
    }
    
    try {
        const response = await axios.put(`/user/editmyinform`,requestData);
        
        setPassword(password);
        setEmail(email);
        setNickname(nickname);
        setWideRegion(wideRegion);
        setDetailRegion(detailRegion);

        console.log(response.data);
        alert('회원정보 수정 완료');
        routing(`/mypage/myinform`);
    } catch (error) {
        console.error('update info error:', error);
        alert('update INFO error');
    }
}
    return (
    <div className={styles.container}>
        <form>
              <table className={styles.table}>
                <tr>
                    <td className={styles.tableBold}>아이디</td>
                    <td>{logginedUserId}</td>
                </tr>
                <tr>
                    <td className={styles.tableBold}>비밀번호</td>
                <input
                    type="password"
                    id="password"
                    value={password}
                    placeholder="비밀번호를 입력하세요."
                    onChange={(e) => setPassword(e.target.value)}
                />
                {passwordError && <p>{passwordError}</p>}
                </tr>
                <tr>
                    <td className={styles.tableBold}>비밀번호 확인</td>
                <input
                    type="password"
                    id="passwordCheck"
                    value={passwordCheck}
                    placeholder="비밀번호를 확인하세요."
                    onChange={(e) => setPasswordCheck(e.target.value)}
                />
                {passwordCheckError && <p>{passwordCheckError}</p>}
                </tr>

              <tr className={styles.input_group}>
                <td className={styles.tableBold}>닉네임 </td>
                <input
                  type="text"
                  value={nickname}
                  placeholder={user.nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  />
                {nicknameError && <p>{nicknameError}</p>}
              </tr>
      
              <tr className={styles.input_group}>
                <td className={styles.tableBold}>이메일</td>
                <input
                  type="email"
                  value={email}
                  placeholder={user.email}
                  onChange={(e) => setEmail(e.target.value)}
                  />
                 {emailError && <p>{emailError}</p>}
              </tr>
      
              <tr className={styles.input_group}>
                <td className={styles.tableBold}>거래 희망 지역</td>
                <select 
                  onChange={(e) => {
                      setWideRegion(e.target.value);
                      setDetailRegion('');
                  }}
                  onBlur={()=>{
                      if(!wideRegion || !detailRegion) {
                          setRegionError('지역을 선택해주세요.')
                          return;
                        } else {
                            setRegionError('');
                        }
                    }}
                    >
                  <option value=''>선택</option>
                  {Object.keys(regions).map(region => (
                      <option key={region} value={region}>{region}</option>
                      ))}
                </select>
      
                <select 
                  onChange={(e) => {
                      setDetailRegion(e.target.value)
                    }}
                    onBlur={()=>{
                        if(!wideRegion || !detailRegion) {
                            setRegionError('지역을 선택해주세요.')
                            return;
                        } else {
                            setRegionError('');
                        }
                    }}
                    disabled={!wideRegion}>
                  <option value=''>선택</option>
                  {
                      wideRegion ?
                      regions[wideRegion].map(region => (
                          <option key={region} value={region}>{region}</option>
                          )) : null
                        }
                </select>
              </tr>
                {regionError && <p>{regionError}</p>}
              </table>
              <Button variant="outline-success" type="submit" onClick={goEditMyPage}>수정</Button>
            </form>
          </div>
        );
}

export default EditMyInform;