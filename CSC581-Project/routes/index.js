const express = require('express');
const router = express.Router();
const User = require('../controllers/loginController');

router.use (function (req,res,next) {
  console.log('/index/' + req.method);
  next();
});

router.get('/',function(req,res){
  User.index(req, res);
});

module.exports = router;