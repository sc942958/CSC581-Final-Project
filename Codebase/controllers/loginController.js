const path = require('path');
const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.index = function (req, res) {
    res.sendFile(path.resolve('public/login.html'));
};

exports.home = function (req, res) {
    res.sendFile(path.resolve('public/home.html'));
}

exports.login = async function (req, res){
    const user = await User.find({username: req.body.username});
    if(user.length == 0){
        res.sendStatus(401);
    }else{
        match = await bcrypt.compare(req.body.password, user[0].password);
        if(match){
            const accessToken = jwt.sign(
                { "username": req.body.username },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '3000s' }
            );
            res.cookie('jwt', accessToken, { httpOnly: true, maxAge: 50 * 60 * 1000});
            res.redirect("/home");
        } else {
            res.sendStatus(401);
        }
    }
};