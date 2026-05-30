const prisma = require("../config/prisma");
const categoryData = require("./category.data");

const DEFAULT_ENTITY_CATEGORY_NAME = "MISC";

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
    } catch (error) {
      throw error;
    }
  }

  async saveExtractedEntitiesForTransactions(userId, extractedByTransactionId = new Map()) {
    if (!userId || !(extractedByTransactionId instanceof Map) || extractedByTransactionId.size === 0) {
      return { entitiesCreated: 0, linksUpdated: 0 };
    }

    const extractedEntries = [];
    for (const [transactionId, entityName] of extractedByTransactionId.entries()) {
      if (!transactionId || !entityName) {
        continue;
      }
      extractedEntries.push([transactionId, entityName]);
    }

    if (extractedEntries.length === 0) {
      return { entitiesCreated: 0, linksUpdated: 0 };
    }

    const seenEntityNames = new Set();
    const uniqueEntityNames = [];
    for (const [, entityName] of extractedEntries) {
      if (seenEntityNames.has(entityName)) {
        continue;
      }
      seenEntityNames.add(entityName);
      uniqueEntityNames.push(entityName);
    }

    try {
      const defaultCategory = await categoryData.getOrCreateGlobalByName(DEFAULT_ENTITY_CATEGORY_NAME);
      const entityCreateRows = [];
      for (const name of uniqueEntityNames) {
        entityCreateRows.push({
          userId,
          name,
          categoryId: defaultCategory.id,
        });
      }

      const createdEntities = await prisma.entity.createMany({
        data: entityCreateRows,
        skipDuplicates: true,
      });

      const entities = await prisma.entity.findMany({
        where: {
          userId,
          name: { in: uniqueEntityNames },
        },
        select: { id: true, name: true, categoryId: true },
      });

      const entityByName = new Map();
      for (const entity of entities) {
        entityByName.set(entity.name, entity);
      }

      const transactionIds = [];
      for (const [transactionId] of extractedEntries) {
        transactionIds.push(transactionId);
      }

      const existingAnnotations = await prisma.transactionAnnotation.findMany({
        where: { rawTransactionId: { in: transactionIds } },
        select: { rawTransactionId: true, entityId: true },
      });

      const existingEntityIdByTransactionId = new Map();
      for (const annotation of existingAnnotations) {
        existingEntityIdByTransactionId.set(annotation.rawTransactionId, annotation.entityId);
      }

      let linksUpdated = 0;
      for (const [transactionId, entityName] of extractedEntries) {
        const entity = entityByName.get(entityName);
        if (!entity) {
          continue;
        }

        if (existingEntityIdByTransactionId.get(transactionId)) {
          continue;
        }

        await prisma.transactionAnnotation.upsert({
          where: { rawTransactionId: transactionId },
          update: { entityId: entity.id, userId },
          create: {
            rawTransactionId: transactionId,
            userId,
            entityId: entity.id,
            categoryId: entity.categoryId,
          },
        });
        linksUpdated += 1;
      }

      return {
        entitiesCreated: createdEntities.count || 0,
        linksUpdated,
      };
    } catch (error) {
      throw error;
    }
  }

  async getUserStatementData(userId) {
    if (!userId) {
      return [];
    }

    return await prisma.statementUpload.findMany({
      where: { userId },
      select: {
        id: true,
        userId: true,
        fileName: true,
        fileType: true,
        uploadStatus: true,
        parseError: true,
        uploadedAt: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [{ uploadedAt: "desc" }, { createdAt: "desc" }],
    });
  }
}

module.exports = new UploadData();
