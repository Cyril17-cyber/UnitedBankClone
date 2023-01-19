const nodemailer = require('nodemailer');

//nodemailer stuff
const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
        user: "finance@ubtrusts.online",
        pass: "ubtrusts799$"
    }
});

module.exports = transporter;