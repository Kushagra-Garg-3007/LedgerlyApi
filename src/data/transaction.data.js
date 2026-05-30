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

    const hasCategoryId = Object.prototype.hasOwnProperty.call(annotationData || {}, "categoryId");
    const hasEntityId = Object.prototype.hasOwnProperty.call(annotationData || {}, "entityId");
    const hasNote = Object.prototype.hasOwnProperty.call(annotationData || {}, "note");
    const { categoryId = null, entityId = null, note = null } = annotationData || {};

    try {
      let defaultCategoryId = null;
      if (!hasCategoryId && entityId) {
        const entity = await getPrisma().entity.findFirst({
          where: { id: entityId, userId },
          select: { categoryId: true },
        });
        defaultCategoryId = entity?.categoryId || null;
      }

      const updateData = { userId };
      if (hasCategoryId) {
        updateData.categoryId = categoryId;
      }
      if (hasEntityId) {
        updateData.entityId = entityId;
      }
      if (hasNote) {
        updateData.note = note;
      }

      return await getPrisma().transactionAnnotation.upsert({
        where: { rawTransactionId: transactionId },
        update: updateData,
        create: {
          rawTransactionId: transactionId,
          userId,
          categoryId: hasCategoryId ? categoryId : defaultCategoryId,
          entityId: hasEntityId ? entityId : null,
          note,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findAnnotationByTransactionAndUserId(transactionId, userId) {
    if (!transactionId || !userId) {
      return null;
    }

    try {
      return await getPrisma().transactionAnnotation.findFirst({
        where: {
          rawTransactionId: transactionId,
          userId,
        },
        include: {
          entity: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async applyCategoryToEntity(userId, entityId, categoryId) {
    if (!userId || !entityId) {
      return { annotationsUpdated: 0, entity: null };
    }

    try {
      return await getPrisma().$transaction(async (tx) => {
        const existingEntity = await tx.entity.findFirst({
          where: {
            id: entityId,
            userId,
          },
        });
        if (!existingEntity) {
          return { annotationsUpdated: 0, entity: null };
        }

        const entity = await tx.entity.update({
          where: { id: entityId },
          data: { categoryId },
        });

        const updatedAnnotations = await tx.transactionAnnotation.updateMany({
          where: {
            userId,
            entityId,
          },
          data: { categoryId },
        });

        return {
          entity,
          annotationsUpdated: updatedAnnotations.count || 0,
        };
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new TransactionData();
