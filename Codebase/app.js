const express = require('express');
const app = express();
//const router = express.Router();
const db = require("./db");
const path = require('path');

const index = require('./routes/index');
const login = require('./routes/login');
const register = require('./routes/register'); 
const home = require('./routes/home');
const stats = require('./routes/stats');

const bodyParser = require('body-parser');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');

//const path = __dirname + "/public";
const port = 8080;

//app.set('view engine', 'html');
app.use(express.urlencoded({ extended: true }));
//app.use(express.static('public'));
app.use(express.static(path.join(__dirname, "public")));
console.log(path.join(__dirname, "public"));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/', index);
app.use('/login', login);
app.use('/register', register);
app.use('/stats', stats);

app.use(verifyJWT);
app.use('/home', home);

app.listen(port, function () {
    console.log("The server is up");
});