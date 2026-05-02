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
}

module.exports = new UploadData();