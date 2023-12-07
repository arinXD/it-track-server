var express = require('express');
var router = express.Router();
const models = require('../models');
const SubGroup = models.SubGroup

router.get("/", async (req, res) => {
    const subgroups = await SubGroup.findAll()
    return res.status(200).json({
        ok: true,
        data: subgroups
    })
})

module.exports = router