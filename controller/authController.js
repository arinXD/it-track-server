const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const { v4: uuidv4 } = require("uuid")
const models = require('../models');
const User = models.User
const Student = models.Student
const Teacher = models.Teacher
const EmailVerify = models.EmailVerify
const { hostname } = require("../api/hostname");
const { mailSender } = require("./mailSender");
require("dotenv").config();

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

        await EmailVerify.bulkCreate([verifyData]);
        mailSender.sendMail(mailOption);

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
const signInCredentials = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { role, model } = getRole(email)
        const user = await User.findOne({
            where: { email },
            include: {
                model
            }
        });

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
            const name = child?.first_name && child?.last_name ? `${child?.first_name} ${child?.last_name}` : undefined
            const userData = {
                email,
                name,
                image: user.image,
                role,
                verification: user.verification,
                ...child
            }
            return res.status(200).json({
                ok: true,
                user: userData,
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
    var image
    try {
        const decode = jwt.verify(email, process.env.SECRET_KEY);
        dataEmail = decode.data.email
        image = decode.data.image
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
                image,
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

            req.session.user = dataEmail
            
            return res.status(201).json({
                ok: true,
                data: {
                    role,
                    ...child
                },
            })
        } else {
            const { sign_in_type, email } = result
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
                req.session.user = email
                console.log("login session:", req.sessionID);
                // console.log("Login session:", req.session);
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
        req.session.user = email
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
        const { email, password } = req.body
        const { role, model } = getRole(email)
        const findEmail = await User.findOne({ where: { email } })

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

        const sendEmailStatus = await sendEmailVerification({ id: user.id, email })
        if (sendEmailStatus) {
            const token = jwt.sign({
                email,
                uniqueString: sendEmailStatus,
            }, process.env.SECRET_KEY, { expiresIn: "6h" });

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