const prisma = require("../config/prisma");

class UploadData {
  async createUploadRecord(payload) {
    const { userId, fileName, fileType = "CSV", uploadStatus = "PENDING" } = payload || {};

    if (!userId || !fileName) {
      return null;
    }

    try {
      const result = await prisma.statementUpload.create({
        data: {
          userId,
          fileName,
          fileType,
          uploadStatus,
        },
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  async updateUploadStatus(uploadId, uploadStatus, parseError = null) {
    if (!uploadId || !uploadStatus) {
      return null;
    }

    try {
      const result = await prisma.statementUpload.update({
        where: { id: uploadId },
        data: {
          uploadStatus,
          parseError,
        },
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  async createRawTransactions(rawTransactions = []) {
    if (!Array.isArray(rawTransactions) || rawTransactions.length === 0) {
      return { count: 0 };
    }

    try {
      const result = await prisma.rawTransaction.createMany({
        data: rawTransactions,
        skipDuplicates: true,
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  async findRawTransactionsByUploadId(uploadId) {
    if (!uploadId) {
      return [];
    }
    try {
      return await prisma.rawTransaction.findMany({
        where: { uploadId },
        select: { id: true, description: true },
      });
    }
    catch (error) {
      throw error
    }
  }

  async saveExtractedEntitiesForTransactions(userId, extractedByTransactionId = new Map()) {
    if (!userId || !(extractedByTransactionId instanceof Map) || extractedByTransactionId.size === 0) {
      return { entitiesCreated: 0, linksUpdated: 0 };
    }

    const extractedEntries = Array.from(extractedByTransactionId.entries())
      .filter(([transactionId, entityName]) => Boolean(transactionId && entityName));

    if (extractedEntries.length === 0) {
      return { entitiesCreated: 0, linksUpdated: 0 };
    }

    const uniqueEntityNames = Array.from(new Set(extractedEntries.map(([, entityName]) => entityName)));

    const createdEntities = await prisma.entity.createMany({
      data: uniqueEntityNames.map((name) => ({ userId, name })),
      skipDuplicates: true,
    });

    const entities = await prisma.entity.findMany({
      where: {
        userId,
        name: { in: uniqueEntityNames },
      },
      select: { id: true, name: true },
    });

    const entityIdByName = new Map(entities.map((row) => [row.name, row.id]));
    const transactionIds = extractedEntries.map(([transactionId]) => transactionId);
    const existingAnnotations = await prisma.transactionAnnotation.findMany({
      where: { rawTransactionId: { in: transactionIds } },
      select: { rawTransactionId: true, entityId: true },
    });
    const existingEntityIdByTransactionId = new Map(
      existingAnnotations.map((row) => [row.rawTransactionId, row.entityId]),
    );

    let linksUpdated = 0;
    for (const [transactionId, entityName] of extractedEntries) {
      const entityId = entityIdByName.get(entityName);
      if (!entityId) {
        continue;
      }

      if (existingEntityIdByTransactionId.get(transactionId)) {
        continue;
      }

      await prisma.transactionAnnotation.upsert({
        where: { rawTransactionId: transactionId },
        update: { entityId, userId },
        create: {
          rawTransactionId: transactionId,
          userId,
          entityId,
        },
      });
      linksUpdated += 1;
    }

    return {
      entitiesCreated: createdEntities.count || 0,
      linksUpdated,
    };
  }
}

module.exports = new UploadData();
