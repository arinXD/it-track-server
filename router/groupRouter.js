var express = require('express');
var router = express.Router();
const models = require('../models');
const Group = models.Group

router.get("/", async (req, res) => {
    const groups = await Group.findAll()
    return res.status(200).json({
        ok: true,
        data: groups
    })
})

module.exports = router