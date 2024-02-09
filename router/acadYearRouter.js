var express = require('express');
var router = express.Router();
const models = require('../models');
const Acadyears = models.Acadyears


router.get("/", async (req, res) => {
    try {
        const acadyears = await Acadyears.findAll({
            attributes: ["acadyear", "createdAt", "updatedAt"],
            order: [
                ['acadyear', 'DESC'],
            ]
        })
        return res.status(200).json({
            ok: true,
            data: acadyears
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Server error"
        })
    }
})

router.get("/:id", async (req, res) => {
    const id = req.params.id
    try {
        const acadyear = await Acadyears.findOne({
            where: {
                acadyear: id
            }
        })
        if (acadyear) {
            acadyear.dataValues.createdAt = formatDateTime(acadyear.dataValues.createdAt)
            acadyear.dataValues.updatedAt = formatDateTime(acadyear.dataValues.updatedAt)
            if (acadyear.dataValues.daletedAt) {
                acadyear.dataValues.daletedAt = formatDateTime(acadyear.dataValues.daletedAt)
            }
            return res.status(200).json({
                ok: true,
                data: acadyear
            })
        } else {
            return res.status(404).json({
                ok: false,
                data: "Academic year not found"
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: "Server error"
        })
    }
})

router.post("/", async (req, res) => {
    const acadyears = req.body.acadyear
    let result = []
    try {
        if (acadyears.length === 0) {
            return res.status(400).json({
                ok: false,
                message: `กรุณากรอกข้อมูล`
            })
        }
        for (let acadyear of acadyears) {
            const acad = await Acadyears.findOne({
                where: {
                    acadyear
                }
            })
            if (acad) {
                result.push({
                    ok: false,
                    message: `ปีการศึกษา ${acadyear} ถูกเพิ่มแล้ว`
                })
            } else {
                await Acadyears.create({
                    acadyear
                })
                result.push({
                    ok: true,
                    message: `เพิ่มปีการศึกษา ${acadyear} เรียบร้อย`
                })
            }
        };
        return res.status(200).json({
            ok: true,
            message: `เพิ่มปีการศึกษาเรียบร้อย`,
            data: result
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Data error",
        })
    }
})

router.put("/:id", async (req, res) => {
    const id = req.params.id
    const data = req.body
    if (id === data.acadyear) {
        return res.status(200).json({
            ok: true,
            message: null
        })
    }
    try {
        const acadData = await Acadyears.findOne({
            where: {
                acadyear: id
            }
        })
        if (!acadData) {
            return res.status(404).json({
                ok: true,
                message: `หาปีการศึกษาไม่พบ (${id})`
            })
        }
        await Acadyears.update(data, {
            where: {
                acadyear: id,
            },
        });
        return res.status(200).json({
            ok: true,
            message: `ปีการศึกษา ${id} ถูกแก้ไขเป็น ${data.acadyear}`
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: `ปีการศึกษา ${data.acadyear} ถูกเพิ่มแล้ว`
        })
    }
})

router.delete("/:id", async (req, res) => {
    const id = req.params.id
    try {
        await Acadyears.destroy({
            where: {
                acadyear: id
            },
            force: true
        });
        return res.status(200).json({
            ok: true,
            message: `ลบปีการศึกษา ${id} เรียบร้อย`
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: "Server error"
        })
    }
})
router.delete("/", async (req, res) => {
    const {
        acadyears
    } = req.body
    try {
        const delAcad = []
        acadyears.forEach(async acadyear => {
            delAcad.push(acadyear)
            await Acadyears.destroy({
                where: {
                    acadyear
                },
                force: true
            });

        });
        return res.status(200).json({
            ok: true,
            message: `ลบปีการศึกษา ${delAcad.join(", ")} เรียบร้อย`
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: "Server error"
        })
    }
})



module.exports = router