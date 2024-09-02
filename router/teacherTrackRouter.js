const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const isAdmin = require('../middleware/adminMiddleware');
const isAuth = require('../middleware/authMiddleware');
const teacherController = require('../controller/teacherTrackController');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/images/teachers/'));
    },
    filename: (req, file, cb) => {
        const postfix = file.originalname.split(".").pop();
        const fileName = `${Date.now()}.${postfix}`;
        req.fileName = fileName;
        cb(null, fileName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files (JPEG, PNG, JPG) are allowed!'), false);
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter
});

// Routes
router.get("/", isAdmin, teacherController.getAllTeacherTracks);
router.get("/:track", isAuth, teacherController.getTeachersByTrack);
router.get("/empty/teachers", isAdmin, teacherController.getTeachersNotInTrack);


router.post("/", isAdmin, upload.single("image"), teacherController.createOrUpdateTeacher);

router.put("/:tid/form", isAdmin, upload.single("image"), teacherController.updateTeacherForm);
router.put("/:tid/json", isAdmin, teacherController.updateTeacherJson);

router.delete("/", isAdmin, teacherController.deleteTeachers);

module.exports = router;