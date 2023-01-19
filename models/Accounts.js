const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    img: {
        data: Buffer,
        contentType: String
    },
    title: String,
    acctNo: Number,
    firstName: String,
    middleName: String,
    lastName: String,
    email: String,
    mobileNo: String,
    dob: String,
    nationality: String,
    city: String,
    state: String,
    country: String,
    accountType: String,
    balance: Number,
    password: String,
    creationYear: Number,
    active: Boolean
});

const Accounts = new mongoose.model('Account', accountSchema);

module.exports = Accounts;