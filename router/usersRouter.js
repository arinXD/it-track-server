var express = require('express');
var router = express.Router();
const models = require('../models');
const isAdmin = require('../middleware/adminMiddleware');

const User = models.User
const Student = models.Student

router.get('/', isAdmin, async (req, res, next) => {
    try {
        const result = await User.findAll({
            include: {
                model: Student
            }
        })
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