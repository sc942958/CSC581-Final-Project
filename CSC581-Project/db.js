const mongoose = require('mongoose');

const MONGO_USERNAME = 'connect4';
const MONGO_PASSWORD = 'super_secure_password';
const MONGO_HOSTNAME = 'database';
const MONGO_PORT = '27017';
const MONGO_DB = 'csc581Final';

const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

mongoose.connect(url);