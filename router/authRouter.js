var express = require('express');
var router = express.Router();
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const Student = prisma.student

router.get('/', async (req, res, next) => {
    try {
        const students = await Student.findMany()
        return res.status(200).json({ students })
    } catch (err) {
        return res.status(500).json({ message: "server error" })
    }
})

router.post('/sign-in', async (req, res, next) => {
    try {
        const data = req.body
        return res.status(200).json({ msg:"Hi" })
    } catch (err) {
        return res.status(500).json({ message: "server error" })
    }
})

module.exports = router