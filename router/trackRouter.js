var express = require('express');
var router = express.Router();
const multer = require('multer')
const path = require('path');
const models = require('../models');
const Track = models.Track

var fileName
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const folderName = req.params.type || "img"
        cb(null, path.join(__dirname, `../public/images/tracks/${folderName}/`))
    },
    filename: function (req, file, cb) {
        const postFix = file.originalname.split(".").pop()
        const track = req.params.track.toLowerCase()
        const folderName = req.params.type || "img"
        fileName = `${folderName}_${track}.${postFix}`
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
    fileFilter
})

router.get("/", async (req, res) => {
    try {
        const data = await Track.findAll()
        return res.status(200).json({
            ok: true,
            data
        })
    } catch (error) {
        return res.status(500).json({
            ok: true,
            message: "Server error."
        })
    }
})
router.get("/:track", async (req, res) => {
    const track = req.params.track
    try {
        const data = await Track.findOne({
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
            ok: true,
            message: "Server error."
        })
    }
})

router.put("/:track", async (req, res) => {
    const track = req.params.track
    const updateData = req.body
    try {
        const data = await Track.update(
            updateData, {
                where: {
                    track
                }
            },
        );
        return res.status(200).json({
            ok: true,
            data
        })
    } catch (error) {
        return res.status(500).json({
            ok: true,
            message: "Server error."
        })
    }
})

router.post("/:track/image/:type", upload.single('image'), async (req, res) => {
    const track = req.params.track
    const fieldImage = req.params.type
    const updateData = req.body
    const img = `http://localhost:4000/images/tracks/${fieldImage}/${fileName}`
    updateData[fieldImage] = img
    try {
        const data = await Track.update(
            updateData, {
                where: {
                    track
                }
            },
        );
        return res.status(200).json({
            ok: true,
            data
        })
    } catch (error) {
        return res.status(500).json({
            ok: true,
            message: "Server error."
        })
    }
})

module.exports = router