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