import React from "react";
import styles from '../styles/MyPage.module.css'; 
import {Link, Outlet} from 'react-router-dom';


function MyPage() {

    return(
        
        <div className={styles.container}>

            
            <div className={styles.item}>
                
                <button className={styles.tab}><Link to ="/mypost">내 글</Link></button>
                <button className={styles.tab}><Link to ="/othertrade">다른 거래</Link></button>
                <button className={styles.tab}><Link to ="/bookmark">북마크</Link></button>
                <button className={styles.tab}><Link to ="/myinform">회원정보</Link></button>
            </div>

            <div className={styles.content}>
                <Outlet/>
            </div>


        </div>

          
    )
}


export default MyPage;