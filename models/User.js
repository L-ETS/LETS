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

 
}

module.exports = User;