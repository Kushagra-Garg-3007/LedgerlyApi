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
      balance: Number(summary.balance || 0)
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

    fromDate = fromDate ? new Date(fromDate): null;

    toDate = toDate ? new Date(toDate).setHours(23, 59, 59, 999) : null;

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

  async updateEntiesWithCategory(userId, payload) {
    const result = await ledgerData.updateEntityCategoryMappingWithAnnotations({
      userId,
      entityId: payload.entityId,
      categoryId: payload.categoryId,
      rawTransactionId: payload.rawTransactionId,
      note: payload.note
    });

    return {
      entityId: result.entity.id.toString(),
      categoryId: result.entity.categoryId?.toString() || null,
      annotationsUpdated: result.annotationsUpdated,
      noteUpdated: result.noteUpdated,
    };
  }

  async updateTransactionAnnotationCategory(userId, payload) {
    const annotation = await ledgerData.updateTransactionAnnotationCategory({
      userId,
      categoryId: payload.categoryId,
      rawTransactionId: payload.rawTransactionId,
      note: payload.note,
    });

    return {
      annotationId: annotation.id.toString(),
      rawTransactionId: annotation.rawTransactionId.toString(),
      categoryId: annotation.categoryId?.toString() || null,
      note: annotation.note,
      noteUpdated: payload.hasNote,
    };
  }
}

module.exports = new LedgerService();
