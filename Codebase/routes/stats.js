const express = require('express');
const router = express.Router();
const stats = require('../controllers/statsController');

router.use (function (req,res,next) {
  console.log('/' + req.method);
  next();
});

router.post('/',function(req,res){
  stats.getStats(req, res);
});

module.exports = router;