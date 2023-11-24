import React, { useState, useEffect, useContext } from "react";
import Button from 'react-bootstrap/Button';
import styles from '../styles/EditMyInform.module.css'; 
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import regions from "./regionData";
import UserContext from "../contexts/UserContext";

function EditMyInform({user}) {
    const { logginedUserId } = useContext(UserContext); //현재 로그인된 유저의 아이디    
    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [wideRegion, setWideRegion] = useState('');
    const [detailRegion, setDetailRegion] = useState('');
    const [nicknameError, setNicknameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [regionError, setRegionError] = useState('');
    const routing =  useNavigate();
    
    const goEditMyPage = async (e) => {
    e.preventDefault();

    const nicknameRegex = /^[가-힣a-zA-Z]{2,10}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
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
        const response = await axios.put(`/user/:userId/editmyinform`, {
            email: email,
            nickname: nickname,
            wideRegion: wideRegion,
            detailRegion: detailRegion
        });
        
        setEmail(user.map(e => e.email === user.email ? {...e, email: email} : e));
        setNickname(user.map(n => n.nickname === user.nickname ? {...n, nickname: nickname} : n));
        setWideRegion(user.map(wr => wr.wideRegion === user.wideRegion ? {...wr, wideRegion: wideRegion} : wr));
        setDetailRegion(user.map(dr => dr.detailRegion === user.detailRegion ? {...dr, detailRegion: detailRegion} : dr));

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
                    <td><input type="password" placeholder=" "/></td>
                </tr>
                <tr>
                    <td className={styles.tableBold}>비밀번호 확인</td>
                    <td><input type="password" placeholder=" "/></td>
                </tr>

              <tr className={styles.input_group}>
                <td className={styles.tableBold}>닉네임 </td>
                <input
                  type="text"
                  id="nickname"
                  value={nickname}
                  placeholder=" "
                  onChange={(e) => setNickname(e.target.value)}
                  />
                {nicknameError && <p>{nicknameError}</p>}
              </tr>
      
              <tr className={styles.input_group}>
                <td className={styles.tableBold}>이메일</td>
                <input
                  type="email"
                  id="email"
                  value={email}
                  placeholder=" "
                  onChange={(e) => setEmail(e.target.value)}
                  />
                 {emailError && <p>{emailError}</p>}
              </tr>
      
              <tr className={styles.input_group}>
                <td className={styles.tableBold}>거래 희망 지역</td>
                <select 
                  value={wideRegion}
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
                  <option value="">선택</option>
                  {Object.keys(regions).map(region => (
                      <option key={region} value={region}>{region}</option>
                      ))}
                </select>
      
                <select 
                  value={detailRegion}
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
                  <option value="">선택</option>
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
            </form>
              <Button variant="outline-success" type="submit" onClick={goEditMyPage}>수정</Button>
          </div>
        );
}

export default EditMyInform;