const express = require("express");
const ledgerController = require("../controllers/ledger.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/summary", authMiddleware, ledgerController.getSummary);
router.get("/transactions", authMiddleware, ledgerController.listTransactions);
router.post("/updateEntities", authMiddleware, ledgerController.updateEntiesWithCategory);
router.post("/updateTransactionAnnotation", authMiddleware, ledgerController.updateTransactionAnnotationCategory);

module.exports = router;
