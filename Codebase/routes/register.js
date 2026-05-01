const express = require('express');
const router = express.Router();
const register = require('../controllers/registerController');

router.use (function (req,res,next) {
  console.log('/register/' + req.method);
  next();
});

router.post('/', function(req, res){
  register.create(req, res);
});

router.get('/', function(req, res){
  register.register(req, res);
});

module.exports = router;