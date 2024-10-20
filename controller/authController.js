const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const { v4: uuidv4 } = require("uuid")
const models = require('../models');
const User = models.User
const Student = models.Student
const Teacher = models.Teacher
const Admin = models.Admin
const EmailVerify = models.EmailVerify
const { hostname } = require("../api/hostname");
const { mailSender } = require("./mailSender");
const { Op } = require("sequelize");
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

        const user = model ? await User.findOne({
            where: { email },
            include: {
                model
            }
        }) :
            await User.findOne({
                where: { email },
            });

        if (!user) {
            return res.status(401).json({
                ok: false,
                message: "Email doesn't exist."
            });
        }

        if (!(user.verification)) {
            return res.status(400).json({
                ok: false,
                message: "Verify your email. Check your inbox."
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

            // ทำไมมันมาออกท่านี้วะ ตอนแรกไม่ได้กะว่าแอดมินกับอาจารย์จะมีชื่อนามสกุล TT
            let name = ""
            if (role === "student") {
                name = child?.first_name && child?.last_name ? `${child?.first_name} ${child?.last_name}` : email.split("@")[0]
            } else {
                name = child?.name && child?.surname ? `${child?.name} ${child?.surname}` : email.split("@")[0]
            }

            const userData = {
                email,
                name,
                image: user.image || "",
                role: user.role,
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
                message: "Password is incorrect."
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

const verifyEmail = (email) => {
    try {
        const decode = jwt.verify(email, process.env.SECRET_KEY);
        return {
            email: decode?.data?.email,
            image: decode?.data?.image,
        }
    } catch (err) {
        return null
    }
}

const signInGoogle = async (req, res, next) => {
    const { email } = req.body;
    const { email: userEmail, image } = verifyEmail(email)

    //  โทเคนผิด
    if (!userEmail) {
        return res.status(401).json({
            ok: false,
            message: "Authentication failed. Invalid token.",
        });
    }

    //  หาโรลของผู้ใช้
    const { role: userRole, model: userModel } = getRole(userEmail)
    const findAdmin = await Admin.findOne({
        where: {
            email: userEmail,
            user_id: {
                [Op.ne]: null
            }
        }
    })
    const findTeacher = await Teacher.findOne({
        where: {
            email: userEmail,
            user_id: {
                [Op.ne]: null
            }
        }
    })

    let role
    let model
    if (findAdmin) {
        role = "admin"
        model = Admin
    } else if (findTeacher) {
        role = "teacher"
        model = Teacher
    } else {
        role = userRole
        model = userModel
    }

    const findUser = model ?
        await User.findOne({
            where: { email: userEmail },
            include: {
                model
            }
        })
        :
        await User.findOne({
            where: { email: userEmail },
        })

    try {
        // ไม่เคยเข้าใช้
        if (!findUser) {
            const useData = {
                email: userEmail,
                sign_in_type: "google",
                image,
                verification: 1,
                role
            }

            //  สร้างผู้ใช้ใหม่
            const user = await User.create(useData)
            let child = {}

            if (model) {
                //  นักศึกษา
                if (user.role === "student") {
                    await model.update({ user_id: user.id }, { where: { email: userEmail } })
                    const childData = await model.findOne({ where: { email: userEmail } })
                    child = { ...childData?.dataValues }
                    child.stu_id = child.stu_id || null
                }
                // เจ้าหน้าที่หรืออาจารย์
                else {
                    const findTeacher = await Teacher.findOne({ where: { email: userEmail } })
                    if (findTeacher) {
                        await Teacher.update({
                            user_id: user.id
                        }, { where: { email: userEmail } })
                        child = { ...findTeacher?.dataValues }
                    } else {
                        const findAdmin = await Admin.findOne({ where: { email: userEmail } })
                        if (!findAdmin) {
                            child = await Admin.create({
                                user_id: user.id,
                                email: userEmail,
                                name: String(userEmail).split("@")[0]
                            })
                        } else {
                            await Admin.update({
                                user_id: user.id
                            }, { where: { email: userEmail } })
                            child = { ...findAdmin?.dataValues }
                        }
                    }
                }
            }

            return res.status(201).json({
                ok: true,
                data: {
                    role,
                    ...child
                },
            })
        }
        //  มีอีเมลแล้ว 
        else {
            const { sign_in_type } = findUser
            if (sign_in_type == "google") {

                await User.update({ image }, { where: { email: userEmail } })

                let child = {}
                if (model) {
                    if (!(findUser.role === "user")) {
                        const modelName = findUser.role.charAt(0).toUpperCase() + findUser.role.slice(1);
                        const childData = findUser[modelName]
                        child = { ...childData?.dataValues }
                    }
                }
                return res.status(200).json({
                    ok: true,
                    data: {
                        role: findUser.role,
                        ...child
                    },
                })
            } else {
                return res.status(409)
                    .header('Content-Type', 'application/json; charset=utf-8')
                    .json({
                        ok: false,
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