const express = require('express');
const router = express.Router();
const models = require('../models');
const { Op } = require('sequelize');
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

const subjectAttr = ["subject_code", "title_th", "title_en", "credit"]

router.get("/:program/:acadyear", isAuth, async (req, res) => {
    const { program, acadyear } = req.params;
    try {
        const data = await Verify.findOne({
            where: {
                program,
                acadyear
            },
            include: [
                {
                    model: Subject,
                    attributes: subjectAttr,
                },
                {
                    model: Program,
                },
                {
                    model: SubjectVerify,
                    include: [
                        {
                            model: Subject,
                            include: [
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
                                                            model: Categorie
                                                        }
                                                    ]
                                                }
                                            ]
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
                                        }
                                    ]
                                },
                                {
                                    model: Track,
                                }
                            ]
                        }
                    ]
                },
            ],
        })
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
