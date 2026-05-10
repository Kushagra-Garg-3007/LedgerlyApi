const ledgerData = require("../data/ledger.data");
const { LedgerSummaryDtoSchema } = require("../models/dtos/ledgerSummary.dto");
const { LedgerTransactionDtoSchema } = require("../models/dtos/ledgerTransaction.dto");

class LedgerService {
  async getSummary(userId) {
    const summary = await ledgerData.getSummaryByUserId(userId);
    return LedgerSummaryDtoSchema.parse({
      totalDebit: Number(summary.totalDebit || 0),
      totalCredit: Number(summary.totalCredit || 0),
      transactionCount: Number(summary.transactionCount || 0),
    });
  }

  async listTransactions(userId) {
    const transactions = await ledgerData.listTransactionsByUserId(userId);
    const responseRows = [];

    for (const transaction of transactions) {
      const amount = Number(transaction.amount || 0);
      const balance =
        transaction.balance === null || transaction.balance === undefined
          ? null
          : Number(transaction.balance);

      let creditAmount = null;
      let debitAmount = null;

      if (transaction.txnType === "CREDIT") {
        creditAmount = amount;
      } else if (transaction.txnType === "DEBIT") {
        debitAmount = amount;
      }

      const date = new Date(transaction.txnDate).toISOString().slice(0, 10);
      const annotation = transaction.annotation;

      const entity =
        annotation?.entity && annotation?.entityId
          ? {
              id: annotation.entity.id,
              name: annotation.entity.name,
            }
          : null;

      const category =
        annotation?.category && annotation?.categoryId
          ? {
              id: annotation.category.id,
              name: annotation.category.name,
            }
          : null;

      responseRows.push({
        id: transaction.id,
        date,
        type: transaction.txnType,
        creditAmount,
        debitAmount,
        balance,
        entity,
        category,
        note: annotation?.note || null,
      });
    }

    return LedgerTransactionDtoSchema.array().parse(responseRows);
  }
}

module.exports = new LedgerService();
