var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config();

router.post('/signin', async (req, res, next) => {
    try {
        console.log('Received form data:', req.body)
        const { email, password } = req.body;
        const [result] = await conn.query(`SELECT * FROM students WHERE email='${email}'`);

        if (result.length === 0) {
            return res.status(401).json({
                ok: false,
                message: "Login failed (wrong email or password)"
            });
        }

        const userData = result[0];
        const match = await bcrypt.compare(password, userData.password);

        if (match) {
            const name = `${userData.fname} ${userData.lname}`;
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
                    role: "student"
                },
                // token
            });
        } else {
            return res.status(401).json({
                ok: false,
                message: "Login failed (wrong email or password)"
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
        const passwordHash = await bcrypt.hash(password, 10)
        const useData = {
            stu_id,
            email,
            password: passwordHash,
            fname,
            lname,
            image: "/img/user.png"
        }

        const [result] = await conn.query("INSERT INTO students SET ?", useData)
        return res.status(201).json({
            ok: true,
            data: result,
        })
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