const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema ({
        username: { type: String, required: true },
        password: { type: String, required: true },
        wins: { type: Number, default: 0 },
        losses: { type: Number, default: 0 },
        draws: { type: Number, default: 0 }
});

module.exports = mongoose.model('User', User);