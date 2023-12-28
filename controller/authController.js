const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
const { v4: uuidv4 } = require("uuid")
const models = require('../models');
const User = models.User
const Student = models.Student
const Teacher = models.Teacher
const EmailVerify = models.EmailVerify
const StudentData = models.StudentData
const { hostname } = require("../api/hostname")
require("dotenv").config();

var mailSender = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD
    }
});

const sendEmailVerification = async ({ id, email }) => {
    const uniqueString = uuidv4() + id
    const htmlTemplate = `
    <h1>Verify your email</h1>
    <p>Verify your email address to complete signup.</p>
    <p>This link will <strong>expire in 6 hours</strong>.</p>
    <p>Press <a href="${hostname}/email-verify/${id}/${uniqueString}">here</a> to proceed.</p>`;
    const mailOption = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Verify your email",
        html: htmlTemplate
    }
    try {
        const hastUniqueString = await bcrypt.hash(uniqueString, 10)
        const verifyData = {
            user_id: id,
            verify_string: hastUniqueString,
            expired_at: new Date()
        }
        verifyData.expired_at.setHours(verifyData.expired_at.getHours() + 6);
        // await conn.query("INSERT INTO email_verify SET ?", verifyData)

        // await EmailVerify.create(verifyData)
        // await mailSender.sendMail(mailOption);

        // bulk create has more protentail
        await EmailVerify.bulkCreate([verifyData]);
        // ลบ await to increase performance
        mailSender.sendMail(mailOption);

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
    let role, model
    if (email.includes(studentEmail)) {
        role = "student"
        model = Student
    } else if (email.includes(teacherEmail)) {
        role = "teacher"
        model = Teacher
    } else {
        role = "user"
        model = null
    }
    return { role, model }
}

/*
*   1st method
    if (role === "student" || role === "user") {
        result = await Student.findOne({
            where: { email: email }
        });
    } else if (role === "teacher") {
        result = await Teacher.findOne({
            where: { email: email }
        });
    } else if (role === "admin") {
        result = await Admin.findOne({
            where: { email: email }
        });
    }
*/
const signInCredentials = async (req, res, next) => {
    try {
        /*
        *   check execution time
        *   1st codezup: 88.434ms
        *   2nd codezup: 32.987ms
        */
        // console.time('codezup')

        /*
        *   2nd method
        */
        const { email, password } = req.body;
        const { role, model } = getRole(email)
        const user = await User.findOne({
            where: { email: email },
            include: {
                model
            }
        });

        // console.timeEnd('codezup')
        // const [result] = await conn.query(`SELECT * FROM students WHERE email='${email}'`);

        if (!user) {
            return res.status(401).json({
                ok: false,
                message: "อีเมลผู้ใช้ไม่ถูกต้อง"
            });
        }

        if (!(user.verification)) {
            return res.status(400).json({
                ok: false,
                message: "อีเมลของคุณยังไม่ถูกยืนยัน กรุณาตรวจสอบ inbox อีเมล"
            });
        }
        const match = await bcrypt.compare(password, user.password);

        if (match) {
            let child = {}
            if (model) {
                const modelName = user.role.charAt(0).toUpperCase() + user.role.slice(1);
                child = user[modelName]
                child = child.dataValues
            }
            const name = `${user.fname} ${user.lname}`;

            // const token = jwt.sign({
            //     email,
            //     name,
            //     image: userData.image,
            //     role: "student"
            // }, process.env.SECRET_KEY, { expiresIn: "2h" });
            return res.status(200).json({
                ok: true,
                user: {
                    email,
                    name,
                    image: user.image,
                    role,
                    firstname: user.fname,
                    lastname: user.lname,
                    verification: user.verification,
                    ...child
                },
                // token
            });
        } else {
            return res.status(401).json({
                ok: false,
                message: "รหัสผ่านไม่ถูกต้อง"
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
    const { email } = req.body;
    var dataEmail
    try {
        const decode = jwt.verify(email, process.env.SECRET_KEY);
        dataEmail = decode.data.email
    } catch (err) {
        return res.status(401).json({
            ok: false,
            message: "Authentication failed. Invalid token.",
        });
    }
    try {
        const { role, model } = getRole(dataEmail)
        let result
        if (model) {
            result = await User.findOne({
                where: { email: dataEmail },
                include: {
                    model
                }
            });
        } else {
            result = await User.findOne({
                where: { email: dataEmail },
            });
        }
        // email doesn't match
        if (!result) {
            const useData = {
                email: dataEmail,
                sign_in_type: "google",
                verification: 1,
                role
            }

            const user = await User.create(useData)
            let child = {}
            if (model) {
                if (user.role === "student") {
                    await model.update({ user_id: user.id }, { where: { email: dataEmail } })
                    child = await model.findOne({ where: { email: dataEmail } })
                    if (child) {
                        child = { ...child.dataValues }
                    }
                } else {
                    child = await model.create({ user_id: user.id })
                }
                if (user.role === "student") {
                    child.stu_id = child.stu_id || null
                }
            }
            return res.status(201).json({
                ok: true,
                data: {
                    role,
                    ...child
                },
            })
        } else {
            const { sign_in_type } = result
            if (sign_in_type == "google") {
                // email match
                let child = {}
                if (model) {
                    if (!(result.role === "user")) {
                        const modelName = result.role.charAt(0).toUpperCase() + result.role.slice(1);
                        child = result[modelName]
                        if (child) {
                            child = { ...child.dataValues }
                        }
                    }
                }
                return res.status(200).json({
                    ok: true,
                    data: {
                        role: result.role,
                        ...child
                    },
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
        // const [result] = await conn.query(`SELECT * FROM students WHERE email='${email}'`);

        const userData = await User.findOne({ where: { email } });

        if (!userData) {
            return res.status(401).json({
                ok: false,
                message: "ไม่พบที่อยู่อีเมล"
            });
        }
        if (!(userData.verification)) {
            return res.status(400).json({
                ok: false,
                message: "อีเมลของคุณยังไม่ถูกยืนยัน กรุณาตรวจสอบ inbox อีเมล"
            });
        }
        const name = `${userData.fname} ${userData.lname}`;
        return res.status(200).json({
            ok: true,
            userData: {
                email,
                name,
                image: userData.image,
                role: userData.role,
                firstname: userData.fname,
                lastname: userData.lname,
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
        const { role, model } = getRole(email)
        const findEmail = await User.findOne({ where: { email } })
        // const [findEmail] = await conn.query(`SELECT * FROM students WHERE email='${email}'`);
        if (findEmail) {
            return res.status(401).json({
                ok: false,
                message: "อีเมลนี้ถูกใช้งานแล้ว",
                errorField: "email"
            });
        }

        const passwordHash = await bcrypt.hash(password, 10)
        const useData = {
            email,
            password: passwordHash,
            image: "/image/user.png",
            role,
            fname,
            lname,
            sign_in_type: "credentials",
        }

        const user = await User.create(useData)
        if (model) {
            if (role == "student") {
                await model.update({ user_id: user.id }, { where: { email: email } })
            } else {
                await model.create({ user_id: user.id })
            }
        }

        // const insertData = await conn.query("INSERT INTO students SET ?", useData)
        const sendEmailStatus = await sendEmailVerification({ id: user.id, email })
        if (sendEmailStatus) {
            const token = jwt.sign({
                email,
                uniqueString: sendEmailStatus,
            }, process.env.SECRET_KEY, { expiresIn: "6h" });

            // ****** Dont work on production. ******
            /*
             res.cookie("token", token, {
                 maxAge: 21600000,  //milli sec
                 secure: true,
                 httpOnly: true,
                 sameSite: "none"
             })
            */

            return res.status(201).json({
                ok: true,
                token: token,
            })
        }
        else {
            return res.status(401).json({
                ok: true,
                message: "Sign up failed. Can't send email"
            })
        }
    } catch (err) {
        if (err) {
            return res.status(409).json({
                ok: false,
                message: err
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