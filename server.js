var mysql = require('mysql');
require("dotenv").config();

var connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  port     : 3306,
  database : process.env.DB_NAME
});

connection.connect();

/* 쿼리 결과 값이 필요 없는 경우 */
//var query = `insert into users(name) values('name')`;
connection.query(query);

/* 쿼리 결과 값을 받아올 경우 */
var query = `select * from users`;
connection.query(query, function(error, rows, fields) {
  if(!error){
    console.log(rows);
    console.log(JSON.parse(JSON.stringify(rows))) // 이렇게 해야 제대로 object 방식으로 사용 가능
  }else{
    console.log('Error while performing Query.', error);
  }
});


connection.end();


const express = require('express');
const path = require('path');
const app = express();

//유저가 보낸 object, array데이터 출력해보기 위함.
app.use(express.json());

//다른 도메인 주소끼리 ajax요청 가능하게함.
let cors = require('cors');
app.use(cors());


app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/', function (request, response) {
  response.sendFile(path.join(__dirname, '/client/build/index.html'));
});

app.listen(8080, function () {
  console.log('listening on 8080')
}); 

//이 코드는 반드시 가장 하단에 놓여야 함. 고객에 URL란에 아무거나 입력하면 index.html(리액트 프로젝트 빌드파일)을 전해달란 의미.
app.get('*', function (request, response) {
  response.sendFile(path.join(__dirname, '/client/build/index.html'));
});