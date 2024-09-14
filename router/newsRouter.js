const express = require('express');
const { getAllNews, createNews, updateNews, deleteMultipleNews, publishNews, getAllPublishedNews, uploadImage } = require('../controller/newsController');
const { newsCreateUploader, newsUpdateUploader } = require('../utils/newsUploader');
const router = express.Router();

router.get("/", getAllNews)
router.get("/:id", getAllNews)
router.get("/published/all", getAllPublishedNews)
router.get("/published/single/:id", getAllPublishedNews)

router.post("/", newsCreateUploader.single("image"), createNews)
router.post("/upload-image", newsCreateUploader.single("image"), uploadImage)

router.put("/:id", newsUpdateUploader.single("image"), updateNews)
router.patch("/:id/publish", publishNews);

router.delete("/multiple", deleteMultipleNews)

module.exports = router