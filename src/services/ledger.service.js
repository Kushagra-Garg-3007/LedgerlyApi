const ledgerData = require("../data/ledger.data");
const { LedgerSummaryDtoSchema } = require("../models/dtos/ledgerSummary.dto");

class LedgerService {
  async getSummary(userId) {
    const summary = await ledgerData.getSummaryByUserId(userId);
    return LedgerSummaryDtoSchema.parse({
      totalDebit: Number(summary.totalDebit || 0),
      totalCredit: Number(summary.totalCredit || 0),
      transactionCount: Number(summary.transactionCount || 0),
    });
  }
}

module.exports = new LedgerService();
