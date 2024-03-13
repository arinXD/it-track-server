var express = require('express');
var router = express.Router();
const models = require('../models');
const StudentStatus = models.StudentStatus

router.get("/", async (req, res) => {
    try {
        const status = await StudentStatus.findAll()
        return res.status(200).json({
            ok: true,
            data: status
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        })
    }
})

module.exports = router