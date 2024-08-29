const express = require('express');
const router = express.Router();
const models = require('../models');
const { Op, where } = require('sequelize');
const isAdmin = require("../middleware/adminMiddleware");
const isAuth = require('../middleware/authMiddleware');

const Verify = models.Verify;
const Program = models.Program;
const Subject = models.Subject
const Categorie = models.Categorie
const SubGroup = models.SubGroup
const Group = models.Group
const GroupSubject = models.GroupSubject
const SubjectVerify = models.SubjectVerify
const SubgroupSubject = models.SubgroupSubject
const Track = models.Track
const CategoryVerify = models.CategoryVerify
const SemiSubgroupSubject = models.SemiSubgroupSubject
const SemiSubGroup = models.SemiSubGroup
const ConditionVerify = models.ConditionVerify
const ConditionSubgroupVerify = models.ConditionSubgroupVerify
const ConditionCategoryVerify = models.ConditionCategoryVerify

router.get("/:verify_id", isAdmin, async (req, res) => {
    const { verify_id } = req.params;
    try {
        const condition = await ConditionVerify.findAll({
            where: {
                verify_id
            },
            include: [
                {
                    model: Group,
                },
                {
                    model: Verify,
                }
            ]
        });

        return res.status(200).json({
            ok: true,
            data: condition
        });
    } catch (error) {
        console.error('Error fetching Condition:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal Server Error'
        });
    }
});

router.get("/subgroup/:verify_id", isAdmin, async (req, res) => {
    const { verify_id } = req.params;
    try {
        const condition = await ConditionSubgroupVerify.findAll({
            where: {
                verify_id
            },
            include: [
                {
                    model: SubGroup,
                },
                {
                    model: Verify,
                }
            ]
        });

        return res.status(200).json({
            ok: true,
            data: condition
        });
    } catch (error) {
        console.error('Error fetching Condition:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal Server Error'
        });
    }
});

router.get("/category/:verify_id", isAdmin, async (req, res) => {
    const { verify_id } = req.params;
    try {
        const condition = await ConditionCategoryVerify.findAll({
            where: {
                verify_id
            },
            include: [
                {
                    model: Categorie,
                },
                {
                    model: Verify,
                }
            ]
        });

        return res.status(200).json({
            ok: true,
            data: condition
        });
    } catch (error) {
        console.error('Error fetching Condition:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal Server Error'
        });
    }
});

router.get("/student/group/:verify_id", isAuth, async (req, res) => {
    const { verify_id } = req.params;
    try {
        const condition = await ConditionVerify.findAll({
            where: {
                verify_id
            },
            include: [
                {
                    model: Group,
                },
                {
                    model: Verify,
                }
            ]
        });

        return res.status(200).json({
            ok: true,
            data: condition
        });
    } catch (error) {
        console.error('Error fetching Condition:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal Server Error'
        });
    }
});

router.get("/student/subgroup/:verify_id", isAuth, async (req, res) => {
    const { verify_id } = req.params;
    try {
        const condition = await ConditionSubgroupVerify.findAll({
            where: {
                verify_id
            },
            include: [
                {
                    model: SubGroup,
                },
                {
                    model: Verify,
                }
            ]
        });

        return res.status(200).json({
            ok: true,
            data: condition
        });
    } catch (error) {
        console.error('Error fetching Condition:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal Server Error'
        });
    }
});

router.get("/student/category/:verify_id", isAuth, async (req, res) => {
    const { verify_id } = req.params;
    try {
        const condition = await ConditionCategoryVerify.findAll({
            where: {
                verify_id
            },
            include: [
                {
                    model: Categorie,
                },
                {
                    model: Verify,
                }
            ]
        });

        return res.status(200).json({
            ok: true,
            data: condition
        });
    } catch (error) {
        console.error('Error fetching Condition:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal Server Error'
        });
    }
});

router.post("/group/:verify_id", isAdmin, async (req, res) => {
    try {
        const {
            verify_id,
            credit,
            dec,
            group_id
        } = req.body;

        const semisubgroupgroupSubjectExists = await ConditionVerify.findOne({
            where: { verify_id, group_id }
        });


        if (semisubgroupgroupSubjectExists) {
            return res.status(400).json({
                ok: false,
                message: `มีกลุ่มวิชานี้อยู่ในเงื่อนไขแล้ว`
            });
        }


        const newCondition = await ConditionVerify.create({
            verify_id: verify_id,
            credit: credit,
            dec: dec,
            group_id: group_id
        });

        return res.status(201).json({
            ok: true,
            data: newCondition,
            message: `เพิ่มเงื่อนไขแบบฟอร์มสำเร็จ`,
        });

    } catch (error) {
        console.error('Error inserting Condition:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal Server Error',
            message: `ไม่สามารถเพิ่มเงื่อนไขแบบฟอร์มได้`,
        });
    }
});

router.post("/subgroup/:verify_id", isAdmin, async (req, res) => {
    try {
        const {
            verify_id,
            credit,
            dec,
            sub_group_id
        } = req.body;

        const semisubgroupgroupSubjectExists = await ConditionSubgroupVerify.findOne({
            where: { verify_id, sub_group_id }
        });


        if (semisubgroupgroupSubjectExists) {
            return res.status(400).json({
                ok: false,
                message: `มีกลุ่มย่อยวิชานี้อยู่ในเงื่อนไขแล้ว`
            });
        }

        const newCondition = await ConditionSubgroupVerify.create({
            verify_id: verify_id,
            credit: credit,
            dec: dec,
            sub_group_id: sub_group_id
        });

        return res.status(201).json({
            ok: true,
            data: newCondition,
            message: `เพิ่มเงื่อนไขแบบฟอร์มสำเร็จ`,
        });

    } catch (error) {
        console.error('Error inserting Condition:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal Server Error',
            message: `ไม่สามารถเพิ่มเงื่อนไขแบบฟอร์มได้`,
        });
    }
});

router.post("/category/:verify_id", isAdmin, async (req, res) => {
    try {
        const {
            verify_id,
            credit,
            dec,
            category_id
        } = req.body;

        const semisubgroupgroupSubjectExists = await ConditionCategoryVerify.findOne({
            where: { verify_id, category_id }
        });


        if (semisubgroupgroupSubjectExists) {
            return res.status(400).json({
                ok: false,
                message: `มีหมวดหมู่นี้อยู่ในเงื่อนไขแล้ว`
            });
        }

        const newCondition = await ConditionCategoryVerify.create({
            verify_id: verify_id,
            credit: credit,
            dec: dec,
            category_id: category_id
        });

        return res.status(201).json({
            ok: true,
            data: newCondition,
            message: `เพิ่มเงื่อนไขแบบฟอร์มสำเร็จ`,
        });

    } catch (error) {
        console.error('Error inserting Condition:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal Server Error',
            message: `ไม่สามารถเพิ่มเงื่อนไขแบบฟอร์มได้`,
        });
    }
});

router.delete("/group/:id", isAdmin, async (req, res) => {
    const id = req.params.id;
    try {
        const conditionVerify = await ConditionVerify.findOne({
            where: { id },
        });

        if (!conditionVerify) {
            return res.status(404).json({
                ok: false,
                message: "GroupSubject not found."
            });
        }

        await ConditionVerify.destroy({
            where: { id }
        });

        return res.status(200).json({
            ok: true,
            message: `ลบเงื่อนไขวิชาสำเร็จ`
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        });
    }
});

router.delete("/subgroup/:id", isAdmin, async (req, res) => {
    const id = req.params.id;
    try {
        const conditionSubgroupVerify = await ConditionSubgroupVerify.findOne({
            where: { id },
        });

        if (!conditionSubgroupVerify) {
            return res.status(404).json({
                ok: false,
                message: "ConditionSubgroupVerify not found."
            });
        }

        await conditionSubgroupVerify.destroy({
            where: { id }
        });

        return res.status(200).json({
            ok: true,
            message: `ลบเงื่อนไขวิชาสำเร็จ`
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        });
    }
});

router.delete("/category/:id", isAdmin, async (req, res) => {
    const id = req.params.id;
    try {
        const conditionCategoryVerify = await ConditionCategoryVerify.findOne({
            where: { id },
        });

        if (!conditionCategoryVerify) {
            return res.status(404).json({
                ok: false,
                message: "ConditionCategoryVerify not found."
            });
        }

        await conditionCategoryVerify.destroy({
            where: { id }
        });

        return res.status(200).json({
            ok: true,
            message: `ลบเงื่อนไขวิชาสำเร็จ`
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        });
    }
});


module.exports = router;
