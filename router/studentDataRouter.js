var express = require('express');
var router = express.Router();
const models = require('../models');
const StudentData = models.StudentData
module.exports = router

router.get("/", async (req, res) => {
    try {
        const data = await StudentData.findAll()
        return res.status(200).json({
            ok: true,
            data
        })
    } catch (err) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Server error"
        })
    }
})
router.get("/email/", async (req, res) => {
    const email = req.body.email
    if(!email){
        return res.status(400).json({
            ok: false,
            message: "Provide your email."
        })
    }
    try {
        const data = await StudentData.findOne({ where: { email } })
        return res.status(200).json({
            ok: true,
            data
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            ok: false,
            message: "Server error"
        })
    }
})