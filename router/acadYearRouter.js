var express = require('express');
var router = express.Router();
const models = require('../models');
const Acadyears = models.Acadyears

const formatDateTime = (date) => {
    const originalDateTime = new Date(date);

    const thailandOptions = {
        timeZone: "Asia/Bangkok",
        year: "numeric",
        month: "numeric",
        day: "numeric",
        // hour: "numeric",
        // minute: "numeric",
        // second: "numeric",
        hour12: false,
    };

    const formattedDateTime = originalDateTime.toLocaleString("en-US", thailandOptions);
    return formattedDateTime
}

router.get("/", async (req, res) => {
    try {
        const acadyears = await Acadyears.findAll({
            attributes: ["acadyear", "createdAt", "updatedAt"],
            order: [
                ['acadyear', 'DESC'],
            ]
        })
        for (let e of acadyears) {
            e.dataValues.createdAt = formatDateTime(e.dataValues.createdAt)
            e.dataValues.updatedAt = formatDateTime(e.dataValues.updatedAt)
            if (e.dataValues.daletedAt) {
                e.dataValues.daletedAt = formatDateTime(e.dataValues.daletedAt)
            }
        }
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
        const acadyear = await Acadyears.findOne({ where: { acadyear: id } })
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
    const { acadyear } = req.body
    try {
        await Acadyears.create({ acadyear })
        return res.status(200).json({
            ok: true,
            message: `เพิ่มปีการศึกษา ${acadyear} เรียบร้อย`
        })
    } catch (error) {
        // const { value, type } = error.errors.map(e => {
        //     if (e.value && e.type) {
        //         return {
        //             value: e.value,
        //             type: e.type,
        //         };
        //     }
        //     return null;
        // }).filter(Boolean)[0];

        return res.status(500).json({
            ok: false,
            message: `ปีการศึกษา ${acadyear} ถูกเพิ่มแล้ว`
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
        const acadData = await Acadyears.findOne({ where: { acadyear: id } })
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
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: "Server error"
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
    const { acadyears } = req.body
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