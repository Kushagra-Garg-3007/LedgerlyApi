const express = require("express");

const authRoutes = require("../modules/auth/auth.routes");
const uploadRoutes = require("../modules/uploads/upload.routes");
const transactionRoutes = require("../modules/transactions/transaction.routes");
const ledgerRoutes = require("../modules/ledger/ledger.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/uploads", uploadRoutes);
router.use("/transactions", transactionRoutes);
router.use("/ledger", ledgerRoutes);

module.exports = router;
