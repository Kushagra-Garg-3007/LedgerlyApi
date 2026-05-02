const express = require("express");

const authRoutes = require("./auth.routes");
const uploadRoutes = require("./upload.routes");
const transactionRoutes = require("./transaction.routes");
const ledgerRoutes = require("./ledger.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/uploads", uploadRoutes);
router.use("/transactions", transactionRoutes);
router.use("/ledger", ledgerRoutes);

module.exports = router;
