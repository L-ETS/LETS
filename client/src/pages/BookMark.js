import react from "react";
import styles from '../styles/BookMark.module.css';


function BookMark() {

    return (
        <div className={styles.container}>

            <div>글 제목</div>
                <div>작성자</div>
                <div>글 내용은~~~ 상위 div 반복으로 붙여넣기!</div>
            </div>
    ) 
}

export default BookMark;