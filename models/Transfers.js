const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema({
    transactionType: String, //transfers or the rest
    from: String,
    name: String,
    to: String,
    bank: String,
    amount: String,
    description: String,
    date: String
});

const Transfers = new mongoose.model('Transfer', transferSchema);

module.exports = Transfers;