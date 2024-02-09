var express = require('express');
var router = express.Router();
const models = require('../models');
const bcrypt = require("bcryptjs");
const Admin = models.Admin


router.get("/", async (req, res) => {
    try {
        const admins = await Admin.findAll()
        return res.status(200).json({
            ok: true,
            data: admins
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Server error"
        })
    }
})

router.post("/", async (req, res) => {
    let data = req.body
    const { password } = data
    try {
        const passwordHash = await bcrypt.hash(password, 10)
        data.password = passwordHash

        const insertData = await Admin.create(data)
        return res.status(200).json({
            ok: true,
            data: insertData
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: "Server error",
            error: error
        })
    }
})

module.exports = router