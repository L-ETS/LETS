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
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
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
const mysqlPromise = require('mysql2/promise');
const pool2 = mysqlPromise.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10
});

const mysqlPromise = require('mysql2/promise');
const pool2 = mysqlPromise.createPool({
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
    let body = { ...req.body };

    // Salt and hash the password
    const saltRounds = 10; // the cost of processing the data
    //비밀번호 해시
    const hashedPassword = await bcrypt.hash(body.password, saltRounds);

    let sql = 'INSERT INTO USER(userId,password,nickname,email,wideRegion,detailRegion) VALUES(?,?,?,?,?,?)'
    let params = [body.userId, hashedPassword, body.nickname, body.email, body.wideRegion, body.detailRegion];

    pool.getConnection((error, connection) => {
      if (error) {
        console.log(error);
        res.status(500).json({ message: 'db 커넥션 가져오기 실패.' });
        connection.release();
      }
      else {
        connection.query(sql, params, (error) => {
          if (error) {
            console.error('Error executing the query: ' + error.stack);
            res.status(500).json({ message: 'db 저장 실패.' });
            connection.release();
          }
          else {
            res.status(200).json({ message: '회원정보 저장 성공.' })
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
  const body = { ...req.body };

  let sql = 'SELECT * FROM USER WHERE userId = ?';
  let params = [body.userId];

  pool.getConnection((error, connection) => {
    if (error) {
      console.log(error);
    }
    else {
      connection.query(sql, params, (error, result) => {
        if (error) {
          console.error('Error executing the query: ' + error.stack)
          res.status(401).json({ message: 'db조회 실패' });
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
    res.json({ loggedIn: true, userId: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
})

app.get('/api/getUserRegion', isAuthenticated, (req, res) => {
  pool.getConnection((error, connection) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: 'Database connection error.' });
      connection.release();
    }
    else {
      let sql = `SELECT * FROM user WHERE userId = '${req.session.user}'`
      connection.query(sql, (error, result) => {
        if (error) {
          console.error('Error executing the query: ' + error.stack);
          res.status(500).json({ message: 'db 조회 실패.' });
          connection.release();
        }
        else {
          res.status(200).json({ message: '조회 성공.', user: result[0] })
          connection.release();
        }
      })
    }
  })
})

app.get('/posts', (req, res) => {

  const { wideRegion, detailRegion } = req.query;

  pool.getConnection((error, connection) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: 'Database connection error.' });
      connection.release();
    }
    else {
      let sql = `SELECT * FROM post WHERE wideRegion = '${wideRegion}' AND detailRegion = '${detailRegion}' ORDER BY update_date DESC`;

      connection.query(sql, (error, result) => {
        if (error) {
          console.error('Error executing the query: ' + error.stack);
          res.status(500).json({ message: 'db 조회 실패.' });
          connection.release();
        }
        else {
          res.status(200).json({ message: '조회 성공.', posts: result })

          connection.release();
        }
      })
    }
  })
})

app.get('/user/mypage', isAuthenticated, (req, res) => {
  res.status(200).json({ success: true })
})

app.get('/posts/upload', isAuthenticated, (req, res) => {
  res.status(200).json({ success: true })
})

app.post('/posts', isAuthenticated, upload.array('images'), (req, res) => { //게시글 업로드

  const { title, content, wideRegion, detailRegion } = { ...req.body };
  let postId;

  pool.getConnection((error, connection) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ message: 'Database connection error.' });
    }
    else {
      //post테이블에 게시글 정보 저장.
      let sql = 'INSERT INTO post (userId, title, content, wideRegion, detailRegion) VALUES (?, ?, ?, ?, ?)';
      let params = [req.session.user, title, content, wideRegion, detailRegion];
      connection.query(sql, params, async (error, result) => {
        if (error) {
          console.error('Error executing the query: ' + error.stack)
          connection.release();
          return res.status(500).json({ message: 'db문제 발생.' });
        }
        else {
          //image테이블에 이미지 정보 저장.
          const promises = req.files.map(file => {
            return new Promise((resolve, reject) => {
              sql = 'INSERT INTO image (postId, imageName, imageUrl, s3Key) VALUES (?, ?, ?, ?)';
              postId = result.insertId
              params = [postId, file.originalname, file.location, file.key];
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
            res.status(200).json({ message: '저장완료', postId: postId });
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

//특정 게시글의 모든 이미지 S3에서 삭제하기.
app.delete('/posts/:postId/imageS3', isAuthenticated, async (req, res) => {
  const postId = req.params.postId;
  let s3Keys;

  pool.getConnection((error, connection) => {
    if(error) {
      console.log(error);
      return res.status(500).json({ message: 'Database connection error.' });
    }
    else {
      let sql = 'SELECT s3Key from image WHERE postId = ?';
      let params = [postId];

      connection.query(sql, params, (error, results) => {
        if(error) {
          console.error('Error executing the query: '+ error.stack)
          res.status(500).json({message: 'db조회 실패'});
          connection.release();
        } else {

            s3Keys = results;

            if(s3Keys.length) {
              const deletePromises = s3Keys.map((obj) => {
                const params = {
                  Bucket: process.env.S3_BUCKET,
                  Key: obj.s3Key,
                };

                const command = new DeleteObjectCommand(params);
                return s3.send(command);
              });

              Promise.all(deletePromises)
                .then(() => {
                  res.status(204).json({ message: 'Drop image successfully.' });
                })
                .catch((err) => {
                  console.error('이미지 삭제 실패:', err);
                  res.status(404).json({ error: 'Failed to drop s3 image.' });
                });
              connection.release();
            } else {
              res.status(404).send({ message: 's3Keys not found.' });
              connection.release();
            }

        }
      })
    }
  })
})

//특정 게시글의 모든 이미지 DB에서 삭제하기.
app.delete('/posts/:postId/imageDB', isAuthenticated, async (req, res) => {
  const postId = req.params.postId;

  pool.getConnection((error, connection) => {
    if(error) {
      console.log(error);
      return res.status(500).json({ message: 'Database connection error.' });
    }
    else {
      let sql = 'DELETE * from image WHERE postId = ?';
      let params = [postId];

      connection.query(sql, params, (error, results) => {
        if(error) {
          console.error('Error executing the query: '+ error.stack)
          res.status(500).json({message: 'db삭제 실패'});
          connection.release();
        } else {
          res.status(204).json({message: '삭제 성공'});
          connection.release();
        }
      })
    }
  })
})

//게시글 수정
app.put('/posts/:postId/edit', isAuthenticated, upload.array('images'), (req, res) => { 

  const postId = req.params.postId;
  const { title, content, wideRegion, detailRegion} = {...req.body};
  
  pool.getConnection((error, connection)=>{
    if(error) {
      console.log(error);
      return res.status(500).json({ message: 'Database connection error.' });
    }
    else {
      //post테이블에 게시글 정보 수정.
      let sql = 'UPDATE post SET title = ?, content = ?, wideRegion = ?, detailRegion = ?, update_date = NOW() WHERE postId = ?';
      
      let params = [title, content, wideRegion, detailRegion, postId];
      connection.query(sql, params, async (error, result)=>{
        if(error) {
          console.error('Error updating the post: '+ error)
          connection.release();
          return res.status(500).json({message: 'db문제 발생.'});
        }
        else {
          //기존 image 테이블에 postId로 저장된 기존 이미지들 삭제.
          sql = 'DELETE FROM image WHERE postId = ?';
          connection.query(sql, [postId], async (error, results) => {
            if(error) {
              console.log(error);
              res.status(500).json({message: 'image delete 실패.'});
              connection.release();
            }
            else {
              //image테이블에 이미지 정보 저장.
              const promises = req.files.map(file => {
                return new Promise((resolve, reject) => {
                  sql = 'INSERT INTO image (postId, imageName, imageUrl, s3Key) VALUES (?, ?, ?, ?)';
                  params = [postId, file.originalname, file.location, file.key];
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
    }
  })
});

app.get('/posts/:postId', isAuthenticated, (req, res) => { //특정 게시글 출력
  const postId = req.params.postId;

  let sql = 'SELECT * FROM POST WHERE postId = ?';
  let params = [postId];
  let isMyPost = false;

  pool.getConnection((error, connection) => {
    if (error) {
      console.log(error);
    }
    else {
      connection.query(sql, params, (error, result) => {
        if (error) {
          console.error('Error executing the query: ' + error.stack)
          res.status(401).json({ message: 'db조회 실패' });
          connection.release();
        }
        else {
          let post = result[0]
          let images;
          let comments;


          if (post.userId === req.session.user) {
            isMyPost = true;
          }

          sql = 'SELECT * FROM image WHERE postId = ?';
          params = [postId];
          connection.query(sql, params, (error, result) => {
            if (error) {
              console.error('Error executing the query: ' + error.stack)
              res.status(401).json({ message: 'db조회 실패' });
              connection.release();
            } else {
              images = result;
              console.log(images);
            
              
              //댓글 출력
              sql = 'SELECT * FROM comment WHERE postId = ?';
              params = [postId];
              connection.query(sql, params, (error, results) => {
                if (error) {
                  res.status(401).json({ error: '댓글 db조회 실패' });
                  return;
                } else {
                  comments = results;
                  sql = 'UPDATE post SET view_count = view_count + 1 WHERE postId = ? AND userId != ?';
                  params = [postId, req.session.user];
                  connection.query(sql, params, (error, results) => {
                    if (error) {
                      res.status(500).json({ error: 'Failed to update view count.' });
                      return;
                    }

                    if (results.affectedRows === 0) {
                      // This means the post was the user's own post and the view_count was not increased
                      res.status(200).json({ message: 'Viewed your own post.', post: post, images: images, isMyPost: isMyPost, comments: comments });
                    } else {
                      // The view_count was increased
                      res.status(200).json({ message: 'View count updated successfully.', post: post, images: images, isMyPost: isMyPost, comments: comments });
                    }
                  });
                }
                  connection.release();
                });
              }
            });
          }
        });
      }
    });
  });

app.delete('/posts/:postId', isAuthenticated, (req, res) => { // 게시글 삭제 요청
  const postId = req.params.postId;

  pool.getConnection((error, connection) => {
    if (error) {
      console.log(error);
    }
    else {
      sql = 'SELECT s3Key FROM image WHERE postId = ?';
      params = [postId];
      connection.query(sql, params, (error, results) => {
        if (error) {
          res.status(404).json({ error: 'Failed to find Key.' });
          return;
        }
        const imageKeyDelete = results.map(row => row.s3Key);

        sql = 'DELETE image FROM image INNER JOIN post ON image.postId=post.postId WHERE post.postId = ?';
        params = [postId];
        connection.query(sql, params, (error, results) => {
          if (error) {
            res.status(404).json({ error: 'Failed to drop image.' });
            return;
          }
          sql = 'DELETE * FROM likepost WHERE postId = ?';
          params = [postId];
          connection.query(sql, params, (error, results) => {
            if (error) {
              res.status(404).json({ error: 'Failed to delete likepost.' });
              return;
            }
          })
          if (results.affectedRows === 0) {
            res.status(404).json({ message: 'Failed to find post, image.' });
          } else {
            sql = 'DELETE post FROM post WHERE post.postId = ?';
            params = [postId];
            connection.query(sql, params, (error, results) => {
              if (error) {
                res.status(404).json({ error: 'Failed to drop post.' });
                return;
              }

              const deletePromises = imageKeyDelete.map((imageKey) => {
                const params = {
                  Bucket: process.env.S3_BUCKET,
                  Key: imageKey,
                };

                const command = new DeleteObjectCommand(params);
                return s3.send(command);
              });

              Promise.all(deletePromises)
                .then(() => {
                  res.status(204).json({ message: 'Drop post successfully.' });
                })
                .catch((err) => {
                  console.error('이미지 삭제 실패:', err);
                  res.status(404).json({ error: 'Failed to drop s3 image.' });
                  connection.release();
                });
            });
          }
        });
      });
    }
  })
});
  app.post('/user/likeposts',isAuthenticated, (req,res) => {
    
    const userId = req.query.userId;
    const insertQuery = 'INSERT INTO (userId) VALUES (?)';
    
    connection.query(insertQuery, [userId], (err, result)=>{
      if(err){
        console.error('insert error'+err.message);
        res.status(500).send('좋아요 처리 중 오류');
        return;
      }
      console.log('likeposts table에 userid 저장 성공');
      res.status(200).send('좋아요 처리 완료');
    });
    connection.end();
  });
  app.get('/user/likeposts',(req,res)=>{

    const countQuery = 'SELECT COUNT(userId) AS likeCount FROM likeposts';
    
    connection.query(countQuery, (err, results)=> {
      if(err){
        console.error('count query error' + err.message);
        res.status(500).send('error');
        return;
      }
      const likeCount = results[0].likeCount;
      console.log('likeposts table의 사용자 id 개수'+ likeCount);

      connection.end();
      res.status(200).send('좋아요 처리 완료');
    });
  });
    
app.put('/comment/:commentId/edit', isAuthenticated, (req, res) => { //댓글 수정
  const commentId = req.body.commentId;
  const commentContent = req.body.content;

  pool.getConnection((error, connection) => {
    if (error) {
      console.log(error);
    }
    else {
      sql = 'UPDATE comment SET content = ? WHERE commentId = ?';
      params = [commentContent, commentId];
      connection.query(sql, params, (error, results) => {
        if (error) {
          res.status(404).json({ error: '댓글 수정 db연결 실패.' });
          return;
        } else {
          sql = 'SELECT * FROM comment WHERE commentId = ?';
          params = [commentId];
          connection.query(sql, params, (error, results) => {
            if (error) {
              res.status(404).json({ error: '댓글 조회 db연결 실패.' });
              return;
            } else {

              res.status(200).json({ message: 'Update comments successfully.', comments: results });
            }
          });
        }
      });
    }
  })
});

app.delete(`/comment/delete`, isAuthenticated, async (req, res) => { //댓글 삭제
  const {commentId} = req.body;

  try {
    const deleteQuery = 'DELETE * FROM comment WHERE commentId = ?';
    const deleteResult = await pool2.execute(deleteQuery, [commentId]);
  
    console.log('Delete Result:', deleteResult);
  
    if (deleteResult && deleteResult.affectedRows > 0) {
      res.status(200).json({ message: 'deleted' });
    } else {
      res.status(404).json({ message: 'failed delete.' });
    }
  } catch (error) {
    console.error('The error is:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/chat/:room_uuid', async (req, res) => {
  try {
    const { room_uuid } = req.params;
    const query = 'SELECT * FROM chatroom WHERE BIN_TO_UUID(room_uuid,0) = ?';
    const [result] = await pool2.execute(query, [room_uuid]);

    if (result.length > 0) {
      res.status(200).json({ message: 'Chat load successfully', chatList: result });
    } else {
      res.status(404).json({ message: 'Room not found.' });
    }
  } catch (error) {
    console.error('The error is: ', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/chat/:user1/:user2/:postId', async (req, res) => {
  try {
    const { user1, user2, postId } = req.params;
    const query = 'SELECT BIN_TO_UUID(room_uuid,0) FROM chatroom WHERE user1 = ? AND user2 = ? AND postId = ?';
    const [result] = await pool2.execute(query, [user1, user2, postId]);

    if (result.length > 0) {
      res.status(200).json({ message: 'Chat load successfully', chatList: result });
    } else {
      res.status(404).json({ message: 'Room not found.' });
    }
  } catch (error) {
    console.error('The error is: ', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/chat/:user1/:user2/:postId', async (req, res) => {
  try {
    const { user1, user2, postId } = req.params;
    const query = 'SELECT BIN_TO_UUID(room_uuid,0) FROM chatroom WHERE user1 = ? AND user2 = ? AND postId = ?';
    const [result] = await pool2.execute(query, [user1, user2, postId]);

    if (result.length === 0) {
      const query2 = 'INSERT INTO chatroom(user1, user2, postId) VALUES (?, ?, ?)';
      const values = [user1, user2, postId];
      await pool2.execute(query2, values);

      res.status(200).json({ message: 'Room created', room_uuid: ''});
    } else {
      res.status(200).json({ message: 'Room already exists', room_uuid: result[0].room_uuid });
    }
  } catch (error) {
    console.error('The error is: ', error);
    res.status(500).json({ error: error.message });
  }
});





//이 코드는 반드시 가장 하단에 놓여야 함. 고객에 URL란에 아무거나 입력하면 index.html(리액트 프로젝트 빌드파일)을 전해달란 의미.
app.get('*', function (request, response) {
  response.sendFile(path.join(__dirname, '/client/build/index.html'));
});
