var express = require('express');
var router = express.Router();
const models = require('../models');
const Acadyears = models.Acadyears

router.get("/", async (req, res) => {
    try {
        const acadyears = await Acadyears.findOne({
            where: { acadyear: 2562 },
            attributes: ['acadyear'],
        })
        return res.status(200).json({
            ok: true,
            data: acadyears
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: "Server error"
        })
    }
})

router.post("/", async (req, res) => {
    const data = req.body
    try {
        const insertData = await Acadyears.create(data)
        return res.status(200).json({
            ok: true,
            data: insertData
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: "Server error"
        })
    }
})

module.exports = router