const express = require('express');
const path = require('path');
const app = express();
const router = express.Router();
const bcrypt = require('bcrypt');
require('dotenv').config();
const mysql = require("mysql2");

//유저가 보낸 object, array데이터 출력해보기 위함.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//다른 도메인 주소끼리 ajax요청 가능하게함.
const cors = require('cors');
app.use(cors());

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/', function (request, response) {
  response.sendFile(path.join(__dirname, '/client/build/index.html'));
});

app.listen(8080, function () {
  console.log('listening on 8080')
});

//DB 커넥션 풀 셋팅. (.env파일에서 변수명 맞춰주세요.)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10
});

//회원가입 요청에 대한 처리와 응답.
app.post('/user/register', async (req, res) => {
  try {
    let body = {...req.body};

    // Salt and hash the password
    const saltRounds = 10; // the cost of processing the data
    //비밀번호 해시
    const hashedPassword = await bcrypt.hash(body.password, saltRounds);

    let sql = 'INSERT INTO USER(userId,password,nickname,email,region) VALUES(?,?,?,?,?)'
    let params = [body.userId, hashedPassword, body.nickname, body.email, body.region];

    pool.getConnection((error, connection)=>{
      if(error) {
        console.log(error);
        res.status(500).json({message: 'db 커넥션 가져오기 실패.'});
        connection.release();
      }
      else {
        connection.query(sql, params, (error)=>{
          if(error) {
            console.error('Error executing the query: '+ error.stack);
            res.status(500).json({message: 'db 저장 실패.'});
            connection.release();
          }
          else {
            res.status(200).json({message: '회원정보 저장 성공.'})
            connection.release();
          }
        })
      }
    })
  }
  catch (error) {
    console.log(error);
  }
})


//이 코드는 반드시 가장 하단에 놓여야 함. 고객에 URL란에 아무거나 입력하면 index.html(리액트 프로젝트 빌드파일)을 전해달란 의미.
app.get('*', function (request, response) {
  response.sendFile(path.join(__dirname, '/client/build/index.html'));
});
