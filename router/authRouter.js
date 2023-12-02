var express = require('express');
var router = express.Router();
const verificationController = require("../controller/verificationController")
const authController = require("../controller/authController")

router.post('/signin/google', authController.signInGoogle)
router.post("/signin/verified/email", authController.signInVerify)
router.post('/signin', authController.signInCredentials);
router.post('/signup', authController.signUp)

router.get("/verify/email/:id/:uniqueString", verificationController.verifyEmail)
router.post("/send-verification", verificationController.sendVerification);

module.exports = router

