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

  async listTransactions(req) {
    let {
      page = 1,
      limit = 31,
      fromDate,
      toDate,
      type,
      categoryId,
      sortDirection = 'desc',
    } = req.query;

    const now = new Date();

    fromDate = fromDate
      ? new Date(fromDate)
      : new Date(now.getFullYear(), now.getMonth(), 1);

    toDate = toDate
      ? new Date(toDate)
      : new Date(now.getFullYear(), now.getMonth() + 1, 0);

    toDate.setHours(23, 59, 59, 999);

    sortDirection =
      sortDirection === 'asc' ? 'asc' : 'desc';

    const result = await ledgerData.listTransactionsByUserId({
      userId: req.user.id,
      startDate: fromDate,
      endDate: toDate,
      page: Number(page),
      limit: Number(limit),
      type,
      categoryId: categoryId ? BigInt(categoryId) : undefined,
      sortDirection,
    });

    const responseRows = result.transactions.map((transaction) => {
      const amount = Number(transaction.amount || 0);

      return {
        id: transaction.id.toString(),
        date: transaction.txnDate.toISOString().slice(0, 10),
        type: transaction.txnType,

        creditAmount:
          transaction.txnType === 'CREDIT'
            ? amount
            : null,

        debitAmount:
          transaction.txnType === 'DEBIT'
            ? amount
            : null,

        balance:
          transaction.balance == null
            ? null
            : Number(transaction.balance),

        entity:
          transaction.annotation?.entity
            ? {
                id: transaction.annotation.entity.id.toString(),
                name: transaction.annotation.entity.name,
              }
            : null,

        category:
          transaction.annotation?.category
            ? {
                id: transaction.annotation.category.id.toString(),
                name: transaction.annotation.category.name,
              }
            : null,

        note: transaction.annotation?.note ?? null,
      };
    });

    return {
      data: LedgerTransactionDtoSchema.array().parse(responseRows),
      totalItems: result.totalItems,
    };
  }
}

module.exports = new LedgerService();
