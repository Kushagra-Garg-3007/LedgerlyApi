const express = require("express");
const multer = require("multer");
const uploadController = require("../../controllers/upload.controller");

const router = express.Router();
const upload = multer({ dest: "tmp/uploads/" });

router.post("/statement", upload.single("file"), uploadController.uploadStatement);

module.exports = router;
