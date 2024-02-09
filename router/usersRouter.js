var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken")
const models = require('../models');
const User = models.User
const Student = models.Student

router.get('/', async (req, res, next) => {
    try {
        const result = await User.findAll({
            include: {
                model: Student
            }
        })
        // // get token
        // const authHeader = req.headers.authorization
        // let authToken
        // if (authHeader) {
        //     authToken = authHeader.split(" ")[1]
        // }
        // const user = jwt.verify(authToken, process.env.SECRET_KEY)
        // console.log(user.role);
        // if (!(user.role == "teacher" || user.role == "administrator" || user.role == "student")) {
        //     throw { message: "dont have permission" }
        // }

        // // query
        // const [result] = await conn.query("SELECT * FROM user")
        return res.status(200).json({
            ok: true,
            users: result
        })
    } catch (err) {
        console.log(err);
        return res.status(403).json({
            ok: false,
            message: "authentication fail",
            err
        })
    }
})


module.exports = router