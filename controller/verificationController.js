const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer")
const models = require('../models');
const EmailVerify = models.EmailVerify
const User = models.User
require("dotenv").config();

var mailSender = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD
    }
});

const verifyEmail = async (req, res) => {
    try {
        const { id: user_id, uniqueString } = req.params
        const userVerify = await EmailVerify.findOne({ where: { user_id } })

        if (userVerify) {
            const { expired_at, verify_string } = userVerify
            const hastUniqueString = verify_string
            const now = new Date()
            if (expired_at < now || expired_at == now) {
                // expired || หมดเวลายืนยัน
                await EmailVerify.destroy({
                    where: {
                        user_id
                    },
                });
                await User.destroy({
                    where: {
                        id: user_id
                    },
                });
                return res.status(400).json({
                    ok: false,
                    message: "This link has expired. Please sign up again."
                });
            } else {
                // not expired || ในเวลา
                bcrypt.compare(uniqueString, hastUniqueString)
                    .then(async result => {
                        if (result) {
                            // update student email verify
                            await User.update({ verification: 1 }, {
                                where: {
                                    id: user_id,
                                },
                            });
                            // delete email verification
                            await EmailVerify.destroy({
                                where: {
                                    user_id
                                },
                            });
                            const userEmail = await User.findOne({
                                where: { id: user_id }, attributes: ['email'],
                            })
                            return res.status(200).json({
                                ok: true,
                                message: "Your email has verified.",
                                userData: {
                                    email: userEmail.email,
                                }
                            });
                        } else {
                            // wrong string verification || รหัสยืนยันผิด
                            return res.status(400).json({
                                ok: false,
                                message: "Invalid email verification stirng. Please check your inbox."
                            });
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        return res.status(400).json({
                            ok: false,
                            message: "Error while comparing verification string."
                        });
                    })
            }
        } else {
            return res.status(400).json({
                ok: false,
                message: "Account record doesn't exist or has been verified already. Please signin."
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        });
    }
}
const sendVerification = async (req, res) => {
    const { email, uniqueString } = req.body
    const currentUrl = "http://localhost:3000"
    const htmlTemplate = `
    <h1>Verify your email</h1>
    <p>Verify your email address to complete signup.</p>
    <p>This link will <strong>expire in 6 hours</strong>.</p>
    <p>Press <a href="${currentUrl}/email-verify/${uniqueString}">here</a> to proceed.</p>`;
    const mailOption = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Verify your email",
        html: htmlTemplate
    }
    try {
        const user = await User.findOne({ where: { email: email }, attributes: ['id'] })
        const checkVerify = await EmailVerify.findOne({ where: { user_id: user.id } })
        if (checkVerify) {
            await mailSender.sendMail(mailOption);
            return res.status(201).json({
                ok: true,
                message: "Sending verification."
            });
        } else {
            return res.status(403).json({
                ok: false,
                verified: true,
                message: "Email has verified."
            });
        }

    } catch (error) {
        console.error(error);
        return res.status(401).json({
            ok: false,
            message: "Error sending email."
        });
    }
}

module.exports = {
    verifyEmail,
    sendVerification
}