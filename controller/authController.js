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

const signInCredentials = async (req, res, next) => {
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
}

const signInGoogle = async (req, res, next) => {
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
}
const signInVerify = async (req, res) => {
    const { email } = req.body;
    try {
        const [result] = await conn.query(`SELECT * FROM students WHERE email='${email}'`);
        const userData = result[0];

        if (result.length === 0) {
            return res.status(401).json({
                ok: false,
                message: "ไม่พบที่อยู่อีเมล"
            });
        }
        if (!userData.verification) {
            return res.status(400).json({
                ok: false,
                message: "อีเมลของคุณยังไม่ถูกยืนยัน กรุณาตรวจสอบ inbox อีเมล"
            });
        }
        const name = `${userData.fname} ${userData.lname}`;
        const role = getRole(email)

        return res.status(200).json({
            ok: true,
            userData: {
                stu_id: userData.stu_id,
                email,
                name,
                image: userData.image,
                role,
                fname: userData.fname,
                lname: userData.lname,
                verification: userData.verification
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            ok: false,
            message: "Server error"
        });
    }
}
const signUp = async (req, res, next) => {
    try {
        const { email, password, fname, lname } = req.body
        const [findEmail] = await conn.query(`SELECT * FROM students WHERE email='${email}'`);
        if (findEmail.length) {
            return res.status(401).json({
                ok: false,
                message: "อีเมลนี้ถูกใช้งานแล้ว",
                errorField: "email"
            });
        }
        // const [findStuId] = await conn.query(`SELECT * FROM students WHERE stu_id='${stu_id}'`);
        // if (findStuId.length) {
        //     return res.status(401).json({
        //         ok: false,
        //         message: "รหัสนักศึกษานี้ถูกไปใช้งานแล้ว",
        //         errorField: "stu_id"
        //     });
        // }

        const passwordHash = await bcrypt.hash(password, 10)
        const useData = {
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
            }, process.env.SECRET_KEY, { expiresIn: "6h" });
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
}
module.exports = {
    signInCredentials,
    signInGoogle,
    signInVerify,
    signUp,
}