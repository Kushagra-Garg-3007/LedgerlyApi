const express = require("express");
const ledgerController = require("../../controllers/ledger.controller");

const router = express.Router();

router.get("/summary", ledgerController.getSummary);

module.exports = router;
