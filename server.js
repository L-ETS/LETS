const express = require('express');
const path = require('path');
const app = express();
const router = express.Router();
const bcrypt = require('bcrypt');
require('dotenv').config();
const mysql = require("mysql2");
const session = require('express-session');
const MySQLStore = require("express-mysql-session")(session);
const cookieParser = require('cookie-parser');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');

//유저가 보낸 object, array데이터 출력해보기 위함.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//다른 도메인 주소끼리 ajax요청 가능하게함.
const cors = require('cors');
const { resolveSoa } = require('dns');
app.use(cors());

app.use(express.static(path.join(__dirname, 'client/build')));
app.use(express.static('public'));    

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

const s3 = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESSKEY,
    secretAccessKey: process.env.S3_SECRETKEY
}
});

const upload = multer({
  storage: multerS3({
      s3: s3,
      bucket: process.env.S3_BUCKET,
      acl: 'public-read',
      key: function (req, file, cb) {
          cb(null, 'productImages/' + Date.now().toString() + '-' + file.originalname) 
      }
  })
});

app.use(cookieParser());

const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

app.use(session({
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,
    httpOnly: true,
    maxAge: 1800000 //밀리초 단위
  },
  name: 'session-cookie'
}));

const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
}

//회원가입 요청에 대한 처리와 응답.
app.post('/user/register', async (req, res) => {
  try {
    let body = {...req.body};

    // Salt and hash the password
    const saltRounds = 10; // the cost of processing the data
    //비밀번호 해시
    const hashedPassword = await bcrypt.hash(body.password, saltRounds);

    let sql = 'INSERT INTO USER(userId,password,nickname,email,wideRegion,detailRegion) VALUES(?,?,?,?,?,?)'
    let params = [body.userId, hashedPassword, body.nickname, body.email, body.wideRegion, body.detailRegion];

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

//로그인 요청에 대한 처리와 응답.
app.post('/user/login', (req, res) => {
  const body = {...req.body};

  let sql = 'SELECT * FROM USER WHERE userId = ?';
  let params = [body.userId];

  pool.getConnection((error, connection)=>{
    if(error) {
      console.log(error);
    }
    else {
      connection.query(sql, params, (error, result)=>{
        if(error) {
          console.error('Error executing the query: '+ error.stack)
          res.status(401).json({message: 'db조회 실패'});
          connection.release();
        }
        else {
          let user = result[0]
          //If user not found or password does not match, send error response
          if (!user || !bcrypt.compareSync(body.password, user.password)) {
            connection.release();
            return res.status(401).json({ error: 'Invalid username or password' });
          }
          
          req.session.user = user.userId;
          res.status(200).json({ message: 'Login successful!' });
          
          connection.release();

        }
      })
    }
  })
})

app.get('/user/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
        return res.status(500).json({ success: false, message: 'Failed to logout' });
    }
    res.clearCookie('session-cookie'); // Clear the session cookie
    res.status(200).json({ success: true, message: 'Logged out' });
  });
})

app.get('/api/check-session', (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true });
  } else {
    res.json({ loggedIn: false });
  }
})

app.get('/api/getUserRegion', isAuthenticated, (req, res) => {
  pool.getConnection((error, connection) => {
    if(error) {
      console.log(error);
      res.status(500).json({message: 'Database connection error.'});
      connection.release();
    }
    else {
      let sql = `SELECT * FROM user WHERE userId = '${req.session.user}'`
      connection.query(sql, (error, result) => {
        if(error) {
          console.error('Error executing the query: '+ error.stack);
          res.status(500).json({message: 'db 조회 실패.'});
          connection.release();
        }
        else {
          res.status(200).json({message: '조회 성공.', user: result[0]})
          connection.release();
        }
      })
    }
  })
})

app.get('/posts', isAuthenticated, (req, res) => {
  
  const {wideRegion, detailRegion} = req.query;
  
  pool.getConnection((error, connection)=>{
    if(error) {
      console.log(error);
      res.status(500).json({message: 'Database connection error.'});
      connection.release();
    }
    else {
      let sql = `SELECT * FROM post WHERE wideRegion = '${wideRegion}' AND detailRegion = '${detailRegion}' ORDER BY update_date DESC`;

      connection.query(sql, (error, result)=>{
        if(error) {
          console.error('Error executing the query: '+ error.stack);
          res.status(500).json({message: 'db 조회 실패.'});
          connection.release();
        }
        else {
          res.status(200).json({message: '조회 성공.', posts: result})

          connection.release();
        }
      })
    }
  })
})

app.get('/user/mypage', isAuthenticated, (req, res) => {
  res.status(200).json({success: true})
})

app.get('/posts/upload', isAuthenticated, (req, res) => {
  res.status(200).json({success: true})
})

app.post('/posts', isAuthenticated, upload.array('images'), (req, res) => { //게시글 업로드

  const { title, content, wideRegion, detailRegion} = {...req.body};
  
  pool.getConnection((error, connection)=>{
    if(error) {
      console.log(error);
      return res.status(500).json({ message: 'Database connection error.' });
    }
    else {
      //post테이블에 게시글 정보 저장.
      let sql = 'INSERT INTO post (userId, title, content, wideRegion, detailRegion) VALUES (?, ?, ?, ?, ?)';
      let params = [req.session.user, title, content, wideRegion, detailRegion];
      connection.query(sql, params, async (error, result)=>{
        if(error) {
          console.error('Error executing the query: '+ error.stack)
          connection.release();
          return res.status(500).json({message: 'db문제 발생.'});
        }
        else {
          //image테이블에 이미지 정보 저장.
          const promises = req.files.map(file => {
            return new Promise((resolve, reject) => {
              sql = 'INSERT INTO image (postId, imageName, imageUrl, s3Key) VALUES (?, ?, ?, ?)';
              params = [result.insertId, file.originalname, file.location, file.key];
              connection.query(sql, params, (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            });
          });

          try {
            await Promise.all(promises);
            connection.release();
            res.status(200).json({ message: '저장완료' });
          } catch (error) {
            console.error('Error executing the query: ' + error.stack);
            connection.release();
            return res.status(500).json({ message: 'db문제 발생.' });
          }

        }
      })
    }
  })
});

app.get('/posts/:postId',isAuthenticated, (req, res) => { //특정 게시글 출력
  const postId = req.params.postId;

  let sql = 'SELECT * FROM POST WHERE postId = ?';
  let params = [postId];
  let isMyPost = false;

  pool.getConnection((error, connection)=>{
    if(error) {
      console.log(error);
    }
    else {
      connection.query(sql, params, (error, result)=>{
        if(error) {
          console.error('Error executing the query: '+ error.stack)
          res.status(401).json({message: 'db조회 실패'});
          connection.release();
        }
        else {
          let post = result[0]
          let images;
          
          
          if(post.userId === req.session.user) {
            isMyPost = true;
          }

          sql = 'SELECT * FROM image WHERE postId = ?';
          params = [postId];
          connection.query(sql, params, (error, result) => {
            if (error) {
              console.error('Error executing the query: '+ error.stack)
              res.status(401).json({message: 'db조회 실패'});
              connection.release();
            } else {
              images = result;

              sql = 'UPDATE post SET view_count = view_count + 1 WHERE postId = ? AND userId != ?';
              params = [postId, req.session.user];
              connection.query(sql, params, (error,results) => {
                if (error) {
                  res.status(500).json({ error: 'Failed to update view count.' });
                  return;
                }
          
                if (results.affectedRows === 0) {
                  // This means the post was the user's own post and the view_count was not increased
                  res.status(200).json({ message: 'Viewed your own post.', post: post, images: images, isMyPost: isMyPost});
                } else {
                  // The view_count was increased
                  res.status(200).json({ message: 'View count updated successfully.', post: post, images: images, isMyPost: isMyPost});
                }
              });
            }          
          });
        }
      });
    }
    // const post_id = [1, 2, 3]; // 특정 postid 배열 (임의)

    //   // 배열 루프 and 각 id마다 쿼리 실행
    //   post_id.forEach((postId) => {
    //   // 특정 postId count + 1 하는 쿼리
    //     const sqlQuery = `
    //       INSERT INTO UserPostCounts (post_id, count)
    //       VALUES (?, 1)
    //       ON DUPLICATE KEY UPDATE count = count + 1
    //     `;
         
    //     const values = [postId];

    //     connection.query(sqlQuery, values, (error, results, fields) => {
    //       if (error) {
    //         console.error('Error executing query:', error);
    //       } else {
    //         console.log('Query executed successfully');
    //       }
    //     });
    //   });
      connection.release();
  });
});

app.delete('/posts/:postId',isAuthenticated, (req, res) => { // 게시글 삭제 요청
  const postId = req.params.postId;

  pool.getConnection((error, connection) => {
    if(error) {
      console.log(error);
    }
    else {
      connection.query(sql, params, (error, result) => {
        if (error) {
          console.error('Error executing the query: '+ error.stack)
          res.status(401).json({message: 'db조회 실패'});
          connection.release();
        } else {
          sql = 'SELECT s3Key FROM image WHERE postId = ?';
          params = [postId];
          connection.query(sql, params, (error,results) => {
            if (error) {
              res.status(500).json({ error: 'Failed to drop post.' });
              return;
            }
            const imageKey = result;

            connection.query(sql, params, (error, result) => {
              if (error) {
                console.error('Error executing the query: '+ error.stack)
                res.status(401).json({message: 'db조회 실패'});
                connection.release();
              } else {
                sql = 'DELETE image, post FROM image inner join post ON image.postId=post.postId WHERE postId = ? AND userId = ?';
                params = [postId, req.session.user];
                connection.query(sql, params, (error,results) => {
                  if (error) {
                    res.status(500).json({ error: 'Failed to drop post.' });
                    return;
                  }
            
                  if (results.affectedRows === 0) {
                    res.status(200).json({ message: 'Failed to drop post.'});
                  } else {
                    imageKey.forEach((imageKey) => {
                      const params = {
                        Bucket: process.env.S3_BUCKET,
                        Key: imageKey,
                      };
                    
                      s3.deleteObject(params, (err, data) => {
                        if (err) {
                          console.error(`Error deleting ${imageKey}: ${err}`);
                        } else {
                          console.log(`Successfully deleted ${imageKey}`);
                          res.status(200).json({ message: 'Drop post successfully.'});
                        }
                      });
                    });
                  }
                });
              }          
            });
          });
        }          
      });
    }
  })
})

//이 코드는 반드시 가장 하단에 놓여야 함. 고객에 URL란에 아무거나 입력하면 index.html(리액트 프로젝트 빌드파일)을 전해달란 의미.
app.get('*', function (request, response) {
  response.sendFile(path.join(__dirname, '/client/build/index.html'));
});
