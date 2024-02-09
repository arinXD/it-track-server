var express = require('express');
var router = express.Router();
const models = require('../models');
const Group = models.Group

router.get("/", async (req, res) => {
    try {
        const groups = await Group.findAll();
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
router.post("/insertGroup", async (req, res) => {
    try {
        const { group_title, catagory_id  } = req.body;

        const newGroup = await Group.create({
            group_title: group_title,
            catagory_id: catagory_id
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

router.get("/:id", async (req, res) => {
    try {
        const groupId = req.params.id;
        const group = await Group.findByPk(groupId);

        if (!group) {
            return res.status(404).json({
                ok: false,
                error: 'Group not found'
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
        const { group_title, catagory_id } = req.body;

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
            catagory_id: catagory_id
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

router.delete("/deleteGroup/:id", async (req, res) => {
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