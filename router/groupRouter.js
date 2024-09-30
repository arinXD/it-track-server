const express = require('express');
const router = express.Router();
const models = require('../models');
const Group = models.Group
const SubGroup = models.SubGroup
const Categorie = models.Categorie
const { Op } = require('sequelize');

const isAdmin = require("../middleware/adminMiddleware");
const isAuth = require('../middleware/authMiddleware');

router.get("/", isAdmin, async (req, res) => {
    { }
    try {
        const groups = await Group.findAll({
            include: [
                {
                    model: Categorie,
                }
            ]
        });
        return res.status(200).json({
            ok: true,
            data: groups
        });
    } catch (error) {
        console.error('Error fetching groups:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal Server Error'
        });
    }
});

router.get("/:groupId/subgroups", isAdmin, async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const subgroups = await SubGroup.findAll({
            where: {
                group_id: groupId
            }
        });
        return res.status(200).json({
            ok: true,
            data: subgroups
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
        const deletedGroup = await Group.findAll({
            paranoid: false,
            where: {
                deletedAt: {
                    [Op.not]: null
                }
                
            },
            include: [
                {
                    model: Categorie,
                }
            ]
        });

        return res.status(200).json({
            ok: true,
            data: deletedGroup
        });
    } catch (error) {
        console.error('Error fetching deleted Group:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal Server Error'
        });
    }
});

router.post("/restoreGroup/:id", isAdmin, async (req, res) => {
    try {
        const groupCodeId = req.params.id;

        const groupCategorie = await Group.findOne({
            where: {
                id: groupCodeId,
                deletedAt: { [Op.not]: null }
            },
            paranoid: false
        });

        if (!groupCategorie) {
            return res.status(404).json({
                success: false,
                error: 'Deleted Group not found'
            });
        }

        await groupCategorie.restore();

        return res.status(200).json({
            success: true,
            message: 'Group restored successfully'
        });
    } catch (error) {
        console.error('Error restoring Group:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        });
    }
});

router.post("/insertGroup", isAdmin, async (req, res) => {
    try {
        const { group_title, category_id } = req.body;

        const newGroup = await Group.create({
            group_title: group_title,
            category_id: category_id
        });

        return res.status(201).json({
            ok: true,
            data: newGroup
        });
    } catch (error) {
        console.error('Error inserting groups:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal Server Error'
        });
    }
});

router.get("/:id", isAdmin, async (req, res) => {
    try {
        const groupId = req.params.id;
        const group = await Group.findByPk(groupId);

        if (!group) {
            return res.status(200).json({
                ok: true,
                data: []
            });
        }

        return res.status(200).json({
            ok: true,
            data: group
        });
    } catch (error) {
        console.error('Error fetching group:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal Server Error'
        });
    }
});


router.post("/updateGroup/:id", async (req, res) => {
    try {
        const groupId = req.params.id;
        const { group_title, category_id } = req.body;

        if (!group_title) {
            return res.status(400).json({
                ok: false,
                error: 'category_title is required in the request body'
            });
        }

        const updateGroup = await Group.findByPk(groupId);

        if (!updateGroup) {
            return res.status(404).json({
                ok: false,
                error: 'Group not found'
            });
        }

        await updateGroup.update({
            group_title: group_title,
            category_id: category_id
            // Add other fields as needed
        });

        return res.status(200).json({
            ok: true,
            data: updateGroup
        });
    } catch (error) {
        console.error('Error updating group:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal Server Error'
        });
    }
});

router.delete("/deleteGroup/:id", isAdmin, async (req, res) => {
    try {
        const groupId = req.params.id;

        const result = await Group.destroy({
            where: {
                id: groupId
            }
        });

        if (result === 0) {
            return res.status(404).json({
                ok: false,
                error: 'Group not found'
            });
        }

        return res.status(200).json({
            ok: true,
            message: 'Group deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting group:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal Server Error'
        });
    }
});



module.exports = router