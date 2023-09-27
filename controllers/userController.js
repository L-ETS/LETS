const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.loginUser = (req, res) => {
  const body = {...req.body};
  User.findById(body.userId, (error, result)=>{
    if(error) {
      console.log(error)
    }
    else {
      let user = result;

      //If user not found or password does not match, send error response
      if (!user || !bcrypt.compareSync(body.pw, user.pw)) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      // Here you would typically create a token or a session and send it to the client
      // For simplicity, we're just sending a success message
      res.status(200).json({ message: 'Login successful!' });
    }
  });
}

exports.registerUser = async (req, res) => {
  try {
    let body = {...req.body};

    // Salt and hash the password
    const saltRounds = 10; // the cost of processing the data
    const hashedPassword = await bcrypt.hash(body.password, saltRounds);

    User.saveUser(body.userId, hashedPassword, body.nickname, body.email, body.region, (error)=>{
      if(error) {
        res.status(500).json({error: 'db저장 실패'});
      }
      else {
        res.status(200).json({message: '회원정보 저장 성공.'});
      }
    })
  }
  catch (error) {
    console.log(error);
  }
}