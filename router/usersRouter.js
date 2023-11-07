var express = require('express');
var router = express.Router();
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const User = prisma.user

router.get('/', async (req, res, next) => {
    try {
        const users = await User.findMany()
        return res.status(200).json({ users })
    } catch (err) {
        return res.status(500).json({ message: "server error" })
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)
        if (!id) {
            return res.status(400).json({ message: `provide user id '/users/:id'` })
        }
        const users = await User.findUnique({
            where: {
                id: id
            }
        })
        return res.status(200).json({ users })
    } catch (err) {
        return res.status(500).json({ message: "server error" })
    }
})

router.get('/all/posts', async (req, res, next) => {
    try {
        const users = await User.findMany({
            include: {
                posts: true,
                profile: true,
            },
        })
        return res.json({ users })
    } catch (err) {
        return res.status(500).json({ message: "server error" })
    }
})

router.get('/:id/posts', async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)
        if (!id) {
            return res.status(400).json({ message: `provide user id '/users/:id'` })
        }
        const users = await User.findUnique({
            where: {
                id: id
            },
            include: {
                posts: true
            }
        })
        return res.status(200).json({ users })
    } catch (err) {
        return res.status(500).json({ message: "server error" })
    }
})

module.exports = router