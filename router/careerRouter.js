const express = require('express');
const router = express.Router();
const models = require('../models');
const Career = models.Career
const isAuth = require("../middleware/authMiddleware")

router.get("/", isAuth, async (req, res) => {
    try {
        const careers = await Career.findAll()
        return res.status(200).json({
            ok: true,
            data: careers
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
    return null
})

module.exports = router