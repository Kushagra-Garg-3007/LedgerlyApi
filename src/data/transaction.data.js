function getPrisma() {
  return require("../config/prisma");
}

class TransactionData {
  async listByUserId(userId) {
    if (!userId) {
      return [];
    }

    return getPrisma().rawTransaction.findMany({
      where: { userId },
      orderBy: { txnDate: "desc" },
    });
  }

  async updateAnnotation(transactionId, userId, annotationData) {
    if (!transactionId || !userId) {
      return null;
    }

    const { categoryId = null, entityId = null, note = null } = annotationData || {};

    return getPrisma().transactionAnnotation.upsert({
      where: { rawTransactionId: transactionId },
      update: { categoryId, entityId, note, userId },
      create: {
        rawTransactionId: transactionId,
        userId,
        categoryId,
        entityId,
        note,
      },
    });
  }
}

module.exports = new TransactionData();
