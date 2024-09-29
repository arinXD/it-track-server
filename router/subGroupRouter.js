const express = require('express');
const router = express.Router();
const models = require('../models');
const SubGroup = models.SubGroup
const SemiSubGroup = models.SemiSubGroup
const Group = models.Group
const Categorie = models.Categorie
const { Op } = require('sequelize');

const isAdmin = require("../middleware/adminMiddleware");
const isAuth = require('../middleware/authMiddleware');

router.get("/", isAdmin, async (req, res) => {
    try {
        const subgroups = await SubGroup.findAll({
            include: [
                {
                    model: Group,
                    include: [
                        {
                            model: Categorie,
                        }
                    ]
                }
            ]
        });
        return res.status(200).json({
            ok: true,
            data: subgroups
        });
    } catch (error) {
        console.error('Error fetching subgroups:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal Server Error'
        });
    }
});

router.get("/:subgroupId/semisubgroups", async (req, res) => {
    try {
        const subgroupId = req.params.subgroupId;
        const subgroup = await SemiSubGroup.findAll({
            where: {
                sub_group_id: subgroupId
            }
        });
        return res.status(200).json({
            ok: true,
            data: subgroup
        });
    } catch (error) {
        console.error('Error fetching subgroups by group ID:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal Server Error'
        });
    }
});


router.get("/getrestore", isAdmin, async (req, res) => {
    try {
        const deletedSubGroup = await SubGroup.findAll({
            paranoid: false,
            where: {
                deletedAt: {
                    [Op.not]: null
                }
            },
            include: [
                {
                    model: Group,
                    include: [
                        {
                            model: Categorie,
                        }
                    ]
                }
            ]
        });

        return res.status(200).json({
            ok: true,
            data: deletedSubGroup
        });
    } catch (error) {
        console.error('Error fetching deleted SubGroup:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal Server Error'
        });
    }
});

router.post("/restoreSubGroup/:id", isAdmin, async (req, res) => {
    try {
        const subgroupCodeId = req.params.id;

        const subgroupCategorie = await SubGroup.findOne({
            where: {
                id: subgroupCodeId,
                deletedAt: { [Op.not]: null }
            },
            paranoid: false
        });

        if (!subgroupCategorie) {
            return res.status(404).json({
                success: false,
                error: 'Deleted SubGroup not found'
            });
        }

        await subgroupCategorie.restore();

        return res.status(200).json({
            success: true,
            message: 'SubGroup restored successfully'
        });
    } catch (error) {
        console.error('Error restoring Group:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        });
    }
});

router.post("/insertSubGroup", isAdmin, async (req, res) => {
    try {
        const { sub_group_title, group_id } = req.body;

        const newSubGroup = await SubGroup.create({
            sub_group_title: sub_group_title,
            group_id: group_id
        });

        return res.status(201).json({
            ok: true,
            data: newSubGroup
        });
    } catch (error) {
        console.error('Error inserting subgroups:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal Server Error'
        });
    }
});

router.get("/:id", isAdmin, async (req, res) => {
    try {
        const subgroupId = req.params.id;
        const subgroup = await SubGroup.findByPk(subgroupId);

        if (!subgroup) {
            return res.status(404).json({
                ok: false,
                error: 'SubGroup not found'
            });
        }

        return res.status(200).json({
            ok: true,
            data: subgroup
        });
    } catch (error) {
        console.error('Error fetching subgroup:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal Server Error'
        });
    }
});


router.post("/updateSubGroup/:id", isAdmin, async (req, res) => {
    try {
        const subgroupId = req.params.id;
        const { sub_group_title, group_id } = req.body;

        if (!sub_group_title) {
            return res.status(400).json({
                ok: false,
                error: 'sub_group_title is required in the request body'
            });
        }

        const updateSubGroup = await SubGroup.findByPk(subgroupId);

        if (!updateSubGroup) {
            return res.status(404).json({
                ok: false,
                error: 'updateSubGroup not found'
            });
        }

        await updateSubGroup.update({
            sub_group_title: sub_group_title,
            group_id: group_id
            // Add other fields as needed
        });

        return res.status(200).json({
            ok: true,
            data: updateSubGroup
        });
    } catch (error) {
        console.error('Error updating subgroup:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal Server Error'
        });
    }
});

router.delete("/deleteSubGroup/:id", isAdmin, async (req, res) => {
    try {
        const subgroupId = req.params.id;

        const result = await SubGroup.destroy({
            where: {
                id: subgroupId
            }
        });

        if (result === 0) {
            return res.status(404).json({
                ok: false,
                error: 'SubGroup not found'
            });
        }

        return res.status(200).json({
            ok: true,
            message: 'SubGroup deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting subgroup:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal Server Error'
        });
    }
});


module.exports = router