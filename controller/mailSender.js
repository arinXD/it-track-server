require("dotenv").config();
const nodemailer = require("nodemailer")
const mailSender = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 465,
    secure: true,
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD
    }
});

module.exports = {
    mailSender
}