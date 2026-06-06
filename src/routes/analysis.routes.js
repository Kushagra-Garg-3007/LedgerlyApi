const express = require("express");
const analysisController = require("../controllers/analysis.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, analysisController.getAnalysisForMonth);

module.exports = router;