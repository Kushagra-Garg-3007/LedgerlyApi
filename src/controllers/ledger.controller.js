const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");
const ledgerService = require("../services/ledger.service");
const {
  buildGetLedgerSummaryResponse,
} = require("../models/responseModel/getLedgerSummary.response.model");

class LedgerController {
  constructor() {
    this.getSummary = asyncHandler(this.getSummary.bind(this));
  }

  async getSummary(req, res) {
    const summaryDto = await ledgerService.getSummary(req.user?.id);
    return ApiResponse.send(res, buildGetLedgerSummaryResponse(summaryDto));
  }
}

module.exports = new LedgerController();
