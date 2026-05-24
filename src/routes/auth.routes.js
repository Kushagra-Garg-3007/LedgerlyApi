const express = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const refreshMiddleware = require("../middlewares/auth.refreshMiddleware");

const router = express.Router();

router.post("/signup", authController.signup);

router.post("/login", authController.login);

router.post("/logout", authMiddleware, authController.logout);

router.get("/profile", authMiddleware, authController.profile);

router.post("/refresh", refreshMiddleware, authController.refresh);

module.exports = router;
