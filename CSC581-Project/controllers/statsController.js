const path = require('path');
const User = require('../models/users');
const jwt = require('jsonwebtoken');

exports.getStats = async function (req, res){
    cookies = req.cookies;
    token = cookies.jwt;
    username = "";
    jwt.verify(
            token, 
            process.env.ACCESS_TOKEN_SECRET,
            (err, decoded) => {
                if(err) {
                    return res.sendStatus(403);
                }
                username = decoded.username;
            }
        )
    user = await User.find({ username: username });
    res.json({
        "username": username,
        "wins": user[0].wins,
        "losses": user[0].losses,
        "draws": user[0].draws
    })
}

exports.addWin = async function (req, res){
    cookies = req.cookies;
    token = cookies.jwt;
    username = "";
    jwt.verify(
            token, 
            process.env.ACCESS_TOKEN_SECRET,
            (err, decoded) => {
                if(err) {
                    return res.sendStatus(403);
                }
                username = decoded.username;
            }
        )
    await User.findOneAndUpdate({ username: username }, { $inc:{ wins:1 }});
    console.log("updating win");
    user = await User.find({ username: username });
    res.json({
        "username": username,
        "wins": user[0].wins,
        "losses": user[0].losses,
        "draws": user[0].draws
    })
}

exports.addLoss = async function (req, res){
    cookies = req.cookies;
    token = cookies.jwt;
    username = "";
    jwt.verify(
            token, 
            process.env.ACCESS_TOKEN_SECRET,
            (err, decoded) => {
                if(err) {
                    return res.sendStatus(403);
                }
                username = decoded.username;
            }
        )
    await User.findOneAndUpdate({ username: username }, { $inc:{ losses:1 }});
    console.log("updating loss");
    user = await User.find({ username: username });
    res.json({
        "username": username,
        "wins": user[0].wins,
        "losses": user[0].losses,
        "draws": user[0].draws
    })
}

exports.addDraw = async function (req, res){
    cookies = req.cookies;
    token = cookies.jwt;
    username = "";
    jwt.verify(
            token, 
            process.env.ACCESS_TOKEN_SECRET,
            (err, decoded) => {
                if(err) {
                    return res.sendStatus(403);
                }
                username = decoded.username;
            }
        )
    await User.findOneAndUpdate({ username: username }, { $inc:{ draws:1 }});
    user = await User.find({ username: username });
    res.json({
        "username": username,
        "wins": user[0].wins,
        "losses": user[0].losses,
        "draws": user[0].draws
    })
}