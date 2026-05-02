const express = require('express');
const router = express.Router();
const login = require('../controllers/loginController');

router.use (function (req,res,next) {
  console.log('/login/' + req.method);
  next();
});

router.post('/', function(req, res){
  login.login(req, res);
});

module.exports = router;