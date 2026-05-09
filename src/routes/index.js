const express = require("express");

const authRoutes = require("./auth.routes");
const uploadRoutes = require("./upload.routes");
const transactionRoutes = require("./transaction.routes");
const ledgerRoutes = require("./ledger.routes");
const categoryRoutes = require("./category.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/uploads", uploadRoutes);
router.use("/transactions", transactionRoutes);
router.use("/ledger", ledgerRoutes);
router.use("/categories", categoryRoutes);

module.exports = router;
