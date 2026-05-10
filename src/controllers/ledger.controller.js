const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");
const ledgerService = require("../services/ledger.service");
const {
  buildGetLedgerSummaryResponse,
} = require("../models/responseModel/getLedgerSummary.response.model");
const {
  buildListLedgerTransactionsResponse,
} = require("../models/responseModel/listLedgerTransactions.response.model");

class LedgerController {
  constructor() {
    this.getSummary = asyncHandler(this.getSummary.bind(this));
    this.listTransactions = asyncHandler(this.listTransactions.bind(this));
  }

  async getSummary(req, res) {
    const summaryDto = await ledgerService.getSummary(req.user?.id);
    return ApiResponse.send(res, buildGetLedgerSummaryResponse(summaryDto));
  }

  async listTransactions(req, res) {
    const transactionsDto = await ledgerService.listTransactions(req.user?.id);
    return ApiResponse.send(res, buildListLedgerTransactionsResponse(transactionsDto));
  }
}

module.exports = new LedgerController();
