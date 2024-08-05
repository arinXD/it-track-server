const express = require('express');
const router = express.Router();
const models = require('../models');
const { Op } = require('sequelize');
const isAdmin = require("../middleware/adminMiddleware");
const isAuth = require('../middleware/authMiddleware');

const Verify = models.Verify;
const StudentVerify = models.StudentVerify;
const StudentVerifyDetail = models.StudentVerifyDetail
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


router.get("/", isAdmin, async (req, res) => {
    try {
        const studentverify = await StudentVerify.findAll();
        return res.status(200).json({
            ok: true,
            data: studentverify
        });
    } catch (error) {
        console.error('Error fetching verify:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal Server Error'
        });
    }
});

router.get("/:stu_id", isAdmin, async (req, res) => {
    const id = req.params.verify_id
    try {
        const verify_id = await Verify.findOne({
            where: {
                verify: id
            },
            attributes: ["id"]
        })

        const data = await Verify.findOne({
            where: {
                verify: id
            },
            include: [
                {
                    model: Program,
                },
                {
                    model: CategoryVerify,
                    include: [
                        {
                            model: Categorie,
                        }
                    ]
                },
                {
                    model: SubjectVerify,
                    where: {
                        verify_id: verify_id?.dataValues?.id,
                    },
                    required: false,
                    include: [
                        {
                            model: Subject,
                            include: [
                                {
                                    model: SemiSubgroupSubject,
                                    include: [
                                        {
                                            model: SemiSubGroup,
                                            include: [
                                                {
                                                    model: SubGroup,
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
                                                }
                                            ]
                                        }
                                        ,
                                        {
                                            model: Verify,
                                            where: {
                                                id: verify_id?.dataValues?.id
                                            },
                                        }
                                    ]
                                },
                                {
                                    model: SubgroupSubject,
                                    include: [
                                        {
                                            model: SubGroup,
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
                                        }
                                        , {
                                            model: Verify,
                                            where: {
                                                id: verify_id?.dataValues?.id
                                            },
                                        }
                                    ]
                                },
                                {
                                    model: GroupSubject,
                                    include: [
                                        {
                                            model: Group,
                                            include: [
                                                {
                                                    model: Categorie
                                                }
                                            ]
                                        }, {
                                            model: Verify,
                                            where: {
                                                id: verify_id?.dataValues?.id
                                            },
                                        }
                                    ]
                                },
                                {
                                    model: Track,
                                },
                                {
                                    model: StudentVerifyDetail,
                                }
                            ]
                        }
                    ]
                },
            ]
        });
        return res.status(200).json({
            ok: true,
            data
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        })
    }
})



module.exports = router;