const express = require('express');
const router = express.Router();
const stats = require('../controllers/statsController');

router.use (function (req,res,next) {
  console.log('/stats/' + req.method);
  next();
});

router.post('/',function(req,res){
  stats.getStats(req, res);
});

router.post('/win',function(req,res){
  console.log("somebody won");
  stats.addWin(req, res);
});

router.post('/loss',function(req,res){
  stats.addLoss(req, res);
});

router.post('/draw',function(req,res){
  stats.addDraw(req, res);
});

router.get('/win',function(req,res){
  res.send("you won");
});



module.exports = router;