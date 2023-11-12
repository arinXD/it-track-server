var express = require('express');
var router = express.Router();

router.get('/', async (rqe, res) => {
    try {
        const posts = [
            { id: 1, title: "Next 14 with Node js" },
            { id: 2, title: "Express with axios" },
        ]
        return res.status(200).json({
            ok: true,
            data: posts
        })
    } catch (err) {
        return res.status(500).json({ message: "server error" })
    }
})

module.exports = router