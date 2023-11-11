var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken")

router.get('/', async (req, res, next) => {
    try {
        // get token
        const authHeader = req.headers.authorization
        let authToken
        if (authHeader) {
            authToken = authHeader.split(" ")[1]
        }
        const user = jwt.verify(authToken, process.env.SECRET_KEY)
        console.log(user.role);
        if (!(user.role == "teacher" || user.role == "administrator" || user.role == "student")) {
            throw { message: "dont have permission" }
        }

        // query
        const [result] = await conn.query("SELECT * FROM user")
        return res.status(200).json({
            ok: true,
            users: result
        })
    } catch (err) {
        return res.status(403).json({
            ok: false,
            message: "authentication fail",
            err
        })
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