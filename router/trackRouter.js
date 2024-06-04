const express = require('express');
const router = express.Router();
const multer = require('multer')
const path = require('path');
const isAuth = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware');
const { getHostname } = require('../api/hostname');
const { getAllTrack, getTrack, updateTrack, insertTrack, removeTracks, getDeletedTracks } = require('../controller/trackController');
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
        const track = req.params.track.toLowerCase().split(" ").join("_")
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
    limits: {
        fileSize: 1024 * 1024 * 2
    },
    fileFilter
})

// GET
router.get("/all", isAuth, getAllTrack)
router.get("/deleted", isAdmin, getDeletedTracks)
router.get("/:track/get-track", getTrack)


// PUT
router.put("/:track", isAdmin, updateTrack)

// POST
router.post("/", isAdmin, insertTrack)
router.post("/:track/image/:type", isAdmin, upload.single('image'), async (req, res) => {
    const track = req.params.track
    const fieldImage = req.params.type
    const updateData = req.body
    const img = `${getHostname()}/images/tracks/${fieldImage}/${fileName}`
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
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        })
    }
})

// DELETE
router.delete("/multiple", isAdmin, removeTracks)

module.exports = router