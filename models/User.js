const pool = require("../config/mysql");

class User {
  static findById(id, callback) {
    let sql = 'SELECT * FROM USER WHERE id = ?';
    let params = [id];

    pool.getConnection((error, connection)=>{
      if(error) {
        console.log(`User.findById() db처리 중 에러: ${error}`);
      }
      else {
        connection.query(sql, params, (error, result)=>{
          if(error) {
            console.error('Error executing the query: '+ error.stack)
            callback(error, null);
          }
          else {
            callback(null, result[0])
            connection.release();

          }
        })
      }
    })
  }

  static saveUser(id, pw, nickname, email, region, callback) {
    let sql = 'INSERT INTO USER(id,pw,nickname,email,region) VALUES(?,?,?,?,?)'
    let params = [id, pw, nickname, email, region];

    pool.getConnection((error, connection)=>{
      if(error) {
        console.log(`User.saveUser() db처리 중 에러: ${error}`);
      }
      else {
        connection.query(sql, params, (error)=>{
          if(error) {
            console.error('Error executing the query: '+ error.stack);
            callback(error);
          }
          else {
            connection.release();
            callback(null);
          }

        })
      }

    })

  }
}

module.exports = User;