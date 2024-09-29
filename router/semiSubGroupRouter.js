const express = require('express');
const router = express.Router();
const models = require('../models');
const SemiSubGroup = models.SemiSubGroup
const SubGroup = models.SubGroup
const Group = models.Group
const Categorie = models.Categorie
const { Op } = require('sequelize');

const isAdmin = require("../middleware/adminMiddleware");
const isAuth = require('../middleware/authMiddleware');

router.get("/", isAdmin, async (req, res) => {
    try {
        const semi = await SemiSubGroup.findAll({
            include: [
                {
                    model: SubGroup,
                    include: {
                        model: Group,
                        include: {
                            model: Categorie,
                        }
                    }
                }
            ]
        });
        return res.status(200).json({
            ok: true,
            data: semi
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        })
    }
})

router.get("/checkDuplicate/:title", async (req, res) => {
    try {
        const { title } = req.params;
        const semi = await SemiSubGroup.findOne({
            where: {
                semi_sub_group_title: title
            }
        });
        if (semi) {
            return res.status(200).json({
                exists: true
            });
        } else {
            return res.status(200).json({
                exists: false
            });
        }
    } catch (error) {
        console.error('Error checking duplicate semi:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal Server Error'
        });
    }
});

router.post("/", isAdmin, async (req, res) => {
    try {
        const { semi_sub_group_title, sub_group_id } = req.body;

        const newSemiSubGroup = await SemiSubGroup.create({
            semi_sub_group_title: semi_sub_group_title,
            sub_group_id: sub_group_id
        });

        return res.status(201).json({
            ok: true,
            data: newSemiSubGroup
        });
    } catch (error) {
        console.error('Error inserting subgroups:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal Server Error'
        });
    }
});

router.delete("/:id", isAdmin, async (req, res) => {
    const id = req.params.id
    try {
        await SemiSubGroup.destroy({
            where: {
                id
            }
        })
        return res.status(200).json({
            ok: true,
            message: "ลบกลุ่มรองวิชาสำเร็จ"
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        })
    }
})

module.exports = router