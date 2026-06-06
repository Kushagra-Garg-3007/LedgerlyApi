const express = require("express");

const authRoutes = require("./auth.routes");
const uploadRoutes = require("./upload.routes");
const ledgerRoutes = require("./ledger.routes");
const categoryRoutes = require("./category.routes");
const analysisRoutes = require("./analysis.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/uploads", uploadRoutes);
router.use("/ledger", ledgerRoutes);
router.use("/categories", categoryRoutes);
router.use("/analysis", analysisRoutes);

module.exports = router;
