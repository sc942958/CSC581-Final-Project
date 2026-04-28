const path = require('path');
const User = require('../models/users');
const bcrypt = require('bcrypt');

exports.register = function (req, res) {
    res.sendFile(path.resolve('public/register.html'));
};

exports.create = async function (req, res) {
    var reqUser = new User(req.body);
    const duplicate = await User.find({ username: reqUser.username });
    if(duplicate.length != 0) return res.sendStatus(409);
    const hashedPassword = await bcrypt.hash(reqUser.password, 10);
    const newUser = new User({
        username: reqUser.username, 
        password: hashedPassword
    })
    await newUser.save();
    res.redirect("/");
};