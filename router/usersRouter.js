var express = require('express');
var router = express.Router();
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const User = prisma.user

router.get('/', async (req, res, next) => {
    const users = await User.findMany()
    return res.status(200).json({ users })
})

router.get('/:id', async (req, res, next) => {
    const id = parseInt(req.params.id)
    if(!id){
        return res.status(400).json({ message: `provide user id '/users/:id'` })
    }
    const users = await User.findUnique({
        where: {
            id: id
        }
    })
    return res.status(200).json({ users })
})

router.get('/all/posts', async (req, res, next) => {
    const users = await User.findMany({
        include: {
            posts: true,
            profile: true,
        },
    })
    return res.json({ users })
})

router.get('/:id/posts', async (req, res, next) => {
    const id = parseInt(req.params.id)
    if(!id){
        return res.status(400).json({ message: `provide user id '/users/:id'` })
    }
    const users = await User.findUnique({
        where: {
            id: id
        },
        include:{
            posts: true
        }
    })
    return res.status(200).json({ users })
})

module.exports = router