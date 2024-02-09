var express = require('express');
var router = express.Router();
const models = require('../models');
const SubGroup = models.SubGroup

router.get("/", async (req, res) => {
    try {
        const subgroups = await SubGroup.findAll();
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

router.post("/insertSubGroup", async (req, res) => {
    try {
        const { sub_group_title, group_id  } = req.body;

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

router.get("/:id", async (req, res) => {
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


router.post("/updateSubGroup/:id", async (req, res) => {
    try {
        const subgroupId = req.params.id;
        const { sub_group_title, group_id  } = req.body;

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

router.delete("/deleteSubGroup/:id", async (req, res) => {
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