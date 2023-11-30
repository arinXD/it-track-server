var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
const { v4: uuidv4 } = require("uuid")
require("dotenv").config();

var mailSender = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD
    }
});

const getRole = (email) => {
    const studentEmail = "kkumail.com"
    const teacherEmail = "kku.ac.th"
    if (email.includes(studentEmail)) {
        return "student"
    }
    else if (email.includes(teacherEmail)) {
        return "teacher"
    } else {
        return "user"
    }
}

const sendEmailVerification = async ({ id, email }) => {
    const currentUrl = "http://localhost:3000"
    const uniqueString = uuidv4() + id
    const htmlTemplate = `
    <h1>Verify your email</h1>
    <p>Verify your email address to complete signup.</p>
    <p>This link will <strong>expire in 6 hours</strong>.</p>
    <p>Press <a href="${currentUrl}/email-verify/${id}/${uniqueString}">here</a> to proceed.</p>`;
    const mailOption = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Verify your email",
        html: htmlTemplate
    }
    try {
        const hastUniqueString = await bcrypt.hash(uniqueString, 10)
        const verifyData = {
            student_id: id,
            verify_string: hastUniqueString,
            expired_at: new Date()
        }
        verifyData.expired_at.setHours(verifyData.expired_at.getHours() + 6);
        await conn.query("INSERT INTO email_verify SET ?", verifyData)
        await mailSender.sendMail(mailOption);

        // return เพื่อนำไปเก็บไว้ใน cookie สำหรับ resend email
        return `${id}/${uniqueString}`

    } catch (err) {
        console.error(err);
        return false
    }
}

router.get("/verify/email/:id/:uniqueString", async (req, res) => {
    try {
        const { id: studentId, uniqueString } = req.params
        const [userVerify] = await conn.query(`SELECT * FROM email_verify WHERE student_id='${studentId}'`);

        if (userVerify.length > 0) {
            const { expired_at, verify_string } = userVerify[0]
            const hastUniqueString = verify_string
            const now = new Date()
            if (expired_at < now || expired_at == now) {
                // expired || หมดเวลายืนยัน
                await conn.query(`DELETE FROM email_verify WHERE student_id='${studentId}'`)
                await conn.query(`DELETE FROM students WHERE id='${studentId}'`)
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
                            await conn.query(`UPDATE students SET verification = 1 WHERE id='${studentId}'`)
                            // delete email verification
                            await conn.query(`DELETE FROM email_verify WHERE student_id='${studentId}'`)
                            const stuData = await conn.query(`SELECT * FROM students WHERE id = '${studentId}'`)
                            const { id, stu_id, email, image, fname, lname, verification } = stuData[0][0]
                            const role = getRole(email)
                            return res.status(200).json({
                                ok: true,
                                message: "Your email has verified.",
                                userData: {
                                    id,
                                    name: `${fname} ${lname}`,
                                    stu_id,
                                    email,
                                    image,
                                    role,
                                    fname,
                                    lname,
                                    verification
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
})

router.post('/signin/google', async (req, res, next) => {
    try {
        const { email } = req.body;
        const [result] = await conn.query(`SELECT * FROM students WHERE email='${email}'`);
        // email doesn't match
        if (result.length === 0) {
            const useData = {
                stu_id: null,
                email,
                sign_in_type: "google",
                verification: 1,
            }
            await conn.query("INSERT INTO students SET ?", useData)
            const role = getRole(email)
            return res.status(201).json({
                ok: true,
                data: {
                    stu_id: null,
                    role
                }
            })
        } else {
            const { sign_in_type } = result[0]
            if (sign_in_type == "google") {
                // email match
                const role = getRole(email)
                return res.status(200).json({
                    ok: true,
                    data: {
                        ...result[0],
                        role
                    }
                })
            } else {
                return res.status(409)
                    .header('Content-Type', 'application/json; charset=utf-8')
                    .json({
                        ok: false,
                        // message: "อีเมลนี้ได้ทำการเข้าสมัครสมาชิกแล้ว กรุณาเข้าสู่ระบบโดยใช้อีเมลและรหัสผ่าน"
                        message: "This email has been already create. Please sign in."
                    })
            }
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            ok: false,
            message: "Server error"
        });
    }
})
router.post('/signin', async (req, res, next) => {
    try {
        // console.log('Received form data:', req.body)
        const { email, password } = req.body;
        const [result] = await conn.query(`SELECT * FROM students WHERE email='${email}'`);

        if (result.length === 0) {
            return res.status(401).json({
                ok: false,
                message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
            });
        }

        const userData = result[0];
        if (!userData.verification) {
            return res.status(400).json({
                ok: false,
                message: "อีเมลของคุณยังไม่ถูกยืนยัน กรุณาตรวจสอบ inbox อีเมล"
            });
        }
        const match = await bcrypt.compare(password, userData.password);

        if (match) {
            const name = `${userData.fname} ${userData.lname}`;
            const role = getRole(email)
            // const token = jwt.sign({
            //     email,
            //     name,
            //     image: userData.image,
            //     role: "student"
            // }, process.env.SECRET_KEY, { expiresIn: "2h" });

            return res.status(200).json({
                ok: true,
                user: {
                    stu_id: userData.stu_id,
                    email,
                    name,
                    image: userData.image,
                    role,
                    fname: userData.fname,
                    lname: userData.lname,
                    verification: userData.verification
                },
                // token
            });
        } else {
            return res.status(401).json({
                ok: false,
                message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            ok: false,
            message: "Server error"
        });
    }
});

router.post('/signup', async (req, res, next) => {
    try {
        const { stu_id, email, password, fname, lname } = req.body
        console.log(req.body);
        const [findEmail] = await conn.query(`SELECT * FROM students WHERE email='${email}'`);
        if (findEmail.length) {
            return res.status(401).json({
                ok: false,
                message: "อีเมลนี้ถูกใช้งานแล้ว",
                errorField: "email"
            });
        }
        const [findStuId] = await conn.query(`SELECT * FROM students WHERE stu_id='${stu_id}'`);
        if (findStuId.length) {
            return res.status(401).json({
                ok: false,
                message: "รหัสนักศึกษานี้ถูกไปใช้งานแล้ว",
                errorField: "stu_id"
            });
        }

        const passwordHash = await bcrypt.hash(password, 10)
        const useData = {
            stu_id,
            email,
            password: passwordHash,
            fname,
            lname,
            image: "/image/user.png"
        }

        const insertData = await conn.query("INSERT INTO students SET ?", useData)
        const sendEmailStatus = await sendEmailVerification({ id: insertData[0].insertId, email })
        if (sendEmailStatus) {
            const token = jwt.sign({
                email,
                uniqueString: sendEmailStatus,
            }, process.env.SECRET_KEY, { expiresIn: "2h" });
            res.cookie("token", token, {
                maxAge: 21600000, // milli sec
                secure: true,
                httpOnly: true,
                sameSite: "none"
            })
            return res.status(201).json({
                ok: true,
                message: "Sign up success",
            })
        }
        else {
            return res.status(401).json({
                ok: true,
                message: "Sign up failed. Can't send email"
            })
        }
    } catch (err) {
        if (err.code == "ER_DUP_ENTRY") {
            return res.status(409).json({
                ok: false,
                message: err.sqlMessage
            })
        }
        console.error(err);
        return res.status(500).json({ message: "server error" })
    }
})

module.exports = router

router.post("/send-verification", async (req, res) => {
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
        const [user] = await conn.query(`SELECT id FROM students WHERE email='${email}'`)
        const {id} = user[0]
        const [checkVerify] = await conn.query(`SELECT * FROM email_verify WHERE student_id='${id}'`);
        if(checkVerify[0]){

            await mailSender.sendMail(mailOption);
    
            return res.status(201).json({
                ok: true,
                message: "Sending verification."
            });
        }else{
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
});