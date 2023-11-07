var express = require('express');
var router = express.Router();
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const Post = prisma.post

router.get('/', async (rqe, res) => {
    try {
        const posts = await Post.findMany()
        return res.status(200).json({ posts })
    } catch (err) {
        return res.status(500).json({ message: "server error" })
    }
})

module.exports = router