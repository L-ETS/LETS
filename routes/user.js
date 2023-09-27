const express = require("express");
const router = express.Router();
const pool = require("../config/mysql");
const bcrypt = require('bcrypt');
const userController = require('../controllers/userController');

router.post('/register', userController.registerUser)
router.post('/login', userController.loginUser);

module.exports = router;