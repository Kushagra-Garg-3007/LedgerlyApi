const transactionData = require("../data/transaction.data");
const categoryData = require("../data/category.data");
const { TransactionDtoSchema } = require("../models/dtos/transaction.dto");
const { AnnotationDtoSchema } = require("../models/dtos/annotation.dto");

class TransactionService {
  async listTransactions(userId) {
    const transactions = await transactionData.listByUserId(userId);
    const runningBalanceByTxnId = this.buildRunningBalanceMap(transactions);
    const responseRows = [];

    for (const entity of transactions) {
      const balance =
        entity.balance === null || entity.balance === undefined ? null : Number(entity.balance);

      responseRows.push({
        id: entity.id,
        uploadId: entity.uploadId,
        txnDate: entity.txnDate,
        description: entity.description,
        amount: Number(entity.amount || 0),
        balance,
        balanceAfterTxn: runningBalanceByTxnId.get(entity.id) ?? 0,
        txnType: entity.txnType,
        sourceRow: entity.sourceRow,
        createdAt: entity.createdAt,
        categoryId: entity.annotation?.categoryId || null,
        categoryName: entity.annotation?.category?.name || null,
      });
    }

    return TransactionDtoSchema.array().parse(responseRows);
  }

  /**
   * Build balance per transaction:
   * - use statement balance if row has it
   * - else calculate from running total (opening = 0)
   */
  buildRunningBalanceMap(transactions) {
    const ordered = [...transactions].sort((a, b) => {
      const dateDiff = new Date(a.txnDate).getTime() - new Date(b.txnDate).getTime();
      if (dateDiff !== 0) {
        return dateDiff;
      }
      return Number(a.sourceRow || 0) - Number(b.sourceRow || 0);
    });

    let running = 0;
    const byId = new Map();

    for (const txn of ordered) {
      const statementBalance =
        txn.balance === null || txn.balance === undefined ? null : Number(txn.balance);

      if (statementBalance !== null && !Number.isNaN(statementBalance)) {
        running = statementBalance;
      } else {
        const amount = Number(txn.amount || 0);
        running += txn.txnType === "CREDIT" ? amount : -amount;
      }

      byId.set(txn.id, running);
    }

    return byId;
  }

  async updateAnnotation(transactionId, userId, annotationData) {
    if (annotationData?.categoryId) {
      const category = await categoryData.findByIdAndUserId(annotationData.categoryId, userId);
      if (!category) {
        const error = new Error("Category not found");
        error.statusCode = 404;
        throw error;
      }
    }

    const annotation = await transactionData.updateAnnotation(transactionId, userId, annotationData);
    if (!annotation) {
      return null;
    }

    return AnnotationDtoSchema.parse({
      id: annotation.id,
      rawTransactionId: annotation.rawTransactionId,
      userId: annotation.userId,
      categoryId: annotation.categoryId,
      entityId: annotation.entityId,
      note: annotation.note,
      createdAt: annotation.createdAt,
      updatedAt: annotation.updatedAt,
    });
  }
}

module.exports = new TransactionService();
