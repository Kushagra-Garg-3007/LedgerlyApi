const express = require("express");
const uploadController = require("../controllers/upload.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { uploadStatementFile } = require("../middlewares/upload.middleware");

const router = express.Router();

router.post("/statement", authMiddleware, uploadStatementFile, uploadController.uploadStatement);

module.exports = router;
