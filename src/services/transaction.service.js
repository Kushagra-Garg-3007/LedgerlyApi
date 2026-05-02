const transactionData = require("../data/transaction.data");
const { TransactionDtoSchema } = require("../models/dtos/transaction.dto");
const { AnnotationDtoSchema } = require("../models/dtos/annotation.dto");

class TransactionService {
  async listTransactions(userId) {
    const transactions = await transactionData.listByUserId(userId);
    return TransactionDtoSchema.array().parse(
      transactions.map((entity) => ({
        id: entity.id,
        uploadId: entity.uploadId,
        txnDate: entity.txnDate,
        description: entity.description,
        amount: Number(entity.amount || 0),
        txnType: entity.txnType,
        sourceRow: entity.sourceRow,
        createdAt: entity.createdAt,
      })),
    );
  }

  async updateAnnotation(transactionId, userId, annotationData) {
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
