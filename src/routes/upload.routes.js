const express = require("express");
const uploadController = require("../controllers/upload.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { uploadStatementFile } = require("../middlewares/upload.middleware");

const router = express.Router();

router.post("/statement", authMiddleware, uploadStatementFile, uploadController.uploadStatement);
router.get("/recent", authMiddleware, uploadController.recent);
module.exports = router;
