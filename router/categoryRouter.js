var express = require('express');
var router = express.Router();
const models = require('../models');
const Categorie = models.Categorie

router.get("/", async (req, res) => {
    const categories = await Categorie.findAll()
    return res.status(200).json({
        ok: true,
        data: categories
    })
})

module.exports = router