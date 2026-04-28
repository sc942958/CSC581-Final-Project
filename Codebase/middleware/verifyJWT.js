const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = function (req, res, next){
    const cookies = req.cookies;
    if(!cookies?.jwt)
        res.sendStatus(401);
    const token = cookies.jwt;
    jwt.verify(
        token, 
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if(err) {
                return res.sendStatus(403);
            }
            req.user = decoded.username;
            next();
        }
    )
}

module.exports = verifyJWT