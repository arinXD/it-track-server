const nodemailer = require("nodemailer")
const mailSender = nodemailer.createTransport({
     service: "gmail",
     auth: {
         user: process.env.SENDER_EMAIL,
         pass: process.env.SENDER_PASSWORD
     }
 });

module.exports = {
     mailSender
}