const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema({
    userId: String,
    details: String,
    date: String
});

const Logins = new mongoose.model('Activities', loginSchema);

module.exports = Logins;