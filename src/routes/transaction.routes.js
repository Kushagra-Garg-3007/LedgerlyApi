const express = require("express");
const transactionController = require("../controllers/transaction.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, transactionController.listTransactions);

router.patch("/:id/annotation", authMiddleware, transactionController.updateAnnotation);
router.patch("/:id/category", authMiddleware, transactionController.updateCategory);

module.exports = router;
