const asyncHandler = require("../utils/asyncHandler");
const ledgerService = require("../services/ledger.service");

class LedgerController {
  constructor() {
    this.getSummary = asyncHandler(this.getSummary.bind(this));
    this.listTransactions = asyncHandler(this.listTransactions.bind(this));
  }

  async getSummary(req, res) {
    const summaryDto = await ledgerService.getSummary(req.user?.id);
    return res.status(200).json(summaryDto);
  }

  async listTransactions(req, res) {
    const transactionsDto = await ledgerService.listTransactions(req.user?.id);
    return res.status(200).json(transactionsDto);
  }
}

module.exports = new LedgerController();
