var express = require('express');
var router = express.Router();
const models = require('../models');
const TeacherTrack = models.TeacherTrack
const multer = require('multer')
const path = require('path');
const { getHostname } = require('../api/hostname');
const fs = require('fs');
var fileName

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, `../public/images/teachers/`))
    },
    filename: function (req, file, cb) {
        const postFix = file.originalname.split(".").pop()
        fileName = `${Date.now()}.${postFix}`
        return cb(null, fileName)
    }
})

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        const error = new Error('Only image files (JPEG, PNG, JPG) are allowed!');
        cb(error, false);
    }
};

const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 2
    },
    fileFilter
})

router.get("/", async (req, res) => {
    try {
        const data = await TeacherTrack.findAll()
        return res.status(200).json({
            ok: true,
            data
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: "Server error."
        })
    }
})

router.get("/:track", async (req, res) => {
    const track = req.params.track
    try {
        const data = await TeacherTrack.findAll({
            where: {
                track
            }
        })
        return res.status(200).json({
            ok: true,
            data
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: "Server error."
        })
    }
})

router.post("/", upload.single("image"), async (req, res) => {
    const image = `${getHostname()}/images/teachers/${fileName}`
    const insertData = req.body
    const existProfessor = await TeacherTrack.findOne({
        where: {
            teacherName: insertData.teacherName
        }
    })
    let upsertData = {}
    console.log(existProfessor);
    if (existProfessor && Object.keys(existProfessor).length > 0) {
        upsertData = insertData
        upsertData.id = existProfessor.dataValues.id
    } else {
        upsertData = insertData
    }
    upsertData.image = image
    try {
        await TeacherTrack.upsert(upsertData)
        if (existProfessor && Object.keys(existProfessor).length > 0) {
            if (existProfessor.dataValues.image) {
                const oldFileName = existProfessor.dataValues.image.split("/").pop()
                const oldFilePath = path.join(__dirname, `../public/images/teachers/${oldFileName}`)
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath)
                }
            }
        }
        return res.status(200).json({
            ok: true,
            message: "เพิ่มข้อมูลสำเร็จ"
        })
    } catch (error) {
        console.log(fileName);
        const filePath = path.join(__dirname, `../public/images/teachers/${fileName}`)
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
        }
        return res.status(401).json({
            ok: false,
            message: "เพิ่มข้อมูลไม่สำเร็จ"
        })
    } finally {
        fileName = ""
    }
})

router.put("/:tid/form", upload.single("image"), async (req, res) => {
    const tid = req.params.tid
    const image = `${getHostname()}/images/teachers/${fileName}`
    const { teacherName } = req.body
    try {
        const teacherData = await TeacherTrack.findOne({
            where: {
                id: tid
            }
        })
        let oldFilePath 
        if (teacherData && Object.keys(teacherData).length > 0) {
            if (teacherData.dataValues.image) {
                const oldFileName = teacherData.dataValues.image.split("/").pop()
                oldFilePath = path.join(__dirname, `../public/images/teachers/${oldFileName}`)
            }
        }
        teacherData.image = image
        teacherData.teacherName = teacherName
        await teacherData.save()
        if (oldFilePath) {
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath)
            }
        }
        return res.status(200).json({
            ok: true,
            message: "เพิ่มข้อมูลสำเร็จ"
        })
    } catch (error) {
        console.log(fileName);
        console.log(error);
        const filePath = path.join(__dirname, `../public/images/teachers/${fileName}`)
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
        }
        return res.status(401).json({
            ok: false,
            message: "เพิ่มข้อมูลไม่สำเร็จ"
        })
    } finally {
        fileName = ""
    }
})

router.put("/:tid/json", async (req, res) => {
    const tid = req.params.tid
    const updateData = req.body
    try {
        await TeacherTrack.update(updateData, {
            where: {
                id: tid
            }
        })
        return res.status(200).json({
            ok: true,
            message: "เพิ่มข้อมูลสำเร็จ"
        })
    } catch (error) {
        return res.status(401).json({
            ok: false,
            message: "เพิ่มข้อมูลไม่สำเร็จ"
        })
    }
})

router.delete("/", async (req, res) => {
    const teacherId = req.body
    try {
        for (const tid of teacherId) {
            await TeacherTrack.destroy({
                where: {
                    id: tid
                },
                force: true
            })
        }
        return res.status(200).json({
            ok: true,
            message: "ลบข้อมูลสำเร็จ"
        })
    } catch (error) {
        return res.status(401).json({
            ok: false,
            message: "ลบข้อมูลไม่สำเร็จ"
        })
    }
})

module.exports = router