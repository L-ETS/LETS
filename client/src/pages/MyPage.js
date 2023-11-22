import {React, useState} from "react";
import styles from '../styles/MyPage.module.css'; 
import { Link, Outlet} from 'react-router-dom';

function MyPage() {

    return(
        
        <div className={styles.container}>
            <div className={styles.item}>
                <Link to ="/mypage/myprofile" style={{textDecoration: "none"}}><button className={styles.tab}>프로필</button></Link>
                <Link to ="/mypage/mypost" style={{textDecoration: "none"}}><button className={styles.tab}>내 글</button></Link>
                <Link to ="/mypage/bookmark" style={{textDecoration: "none"}}><button className={styles.tab}>북마크</button></Link>
                <Link to ="/mypage/myinform" style={{textDecoration: "none"}}><button className={styles.tab}>회원정보</button></Link>
            </div>

            <div className={styles.content}>
                <Outlet/>
            </div>

        </div>

    )
}

export default MyPage;