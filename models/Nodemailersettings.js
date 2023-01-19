require('dotenv').config();
const nodemailer = require('nodemailer');
const pass = process.env.PASS;
const user = process.env.USER;

//nodemailer stuff
const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
        user: user,
        pass: pass
    }
});

module.exports = transporter;