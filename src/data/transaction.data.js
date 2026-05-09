function getPrisma() {
  return require("../config/prisma");
}

class TransactionData {
  async listByUserId(userId) {
    if (!userId) {
      return [];
    }

    try {
      return await getPrisma().rawTransaction.findMany({
        where: { userId },
        orderBy: { txnDate: "desc" },
        include: {
          annotation: {
            include: {
              category: true,
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async updateAnnotation(transactionId, userId, annotationData) {
    if (!transactionId || !userId) {
      return null;
    }

    const { categoryId = null, entityId = null, note = null } = annotationData || {};

    try {
      return await getPrisma().transactionAnnotation.upsert({
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
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new TransactionData();
