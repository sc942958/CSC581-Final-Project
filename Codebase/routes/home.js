const express = require('express');
const router = express.Router();
const User = require('../controllers/loginController');

router.use (function (req,res,next) {
  console.log('/' + req.method);
  next();
});

router.get('/',function(req,res){
  User.home(req, res);
});

module.exports = router;