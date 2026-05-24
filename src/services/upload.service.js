const uploadData = require("../data/upload.data");
const { UploadDtoSchema } = require("../models/dtos/upload.dto");
const statementExcelParser = require("../parsers/statementExcel.parser");
const { extractEntity } = require("../utils/entityExtractor");
const { deleteFile } = require("../utils/file.utils");

class UploadService {
  /**
   * Main upload flow.
   * Save upload info, parse the file, save transactions, and update status.
   */
  async uploadStatement({ file, userId }) {
    const fileName = file?.originalname;
    const filePath = file?.path;
    const fileType = this.getFileType(fileName);
    if (!fileType) {
      return null;
    }

    let createdUpload = null;
    try {
      createdUpload = await uploadData.createUploadRecord({
        userId,
        fileName,
        fileType,
        uploadStatus: "PENDING",
      });

      if (!createdUpload) {
        return null;
      }

      const parsedTransactions = statementExcelParser.parseTransactions(filePath);
      if (parsedTransactions.validRows.length === 0) {
        await uploadData.updateUploadStatus(
          createdUpload.id,
          "FAILED",
          "No valid transaction rows found in uploaded statement",
        );
        const error = new Error("No valid transaction rows found in uploaded statement");
        error.statusCode = 400;
        throw error;
      }

      const rowsToInsert = parsedTransactions.validRows.map((row) => ({
        uploadId: createdUpload.id,
        userId,
        txnDate: row.txnDate,
        description: row.description,
        amount: row.amount,
        balance: row.balance,
        txnType: row.txnType,
        sourceRow: row.sourceRow,
      }));

      const insertResult = await uploadData.createRawTransactions(rowsToInsert);
      const persistedTransactions = await uploadData.findRawTransactionsByUploadId(createdUpload.id);
      const extractedByTransactionId = this.extractEntitiesByTransactionId(persistedTransactions);
      await uploadData.saveExtractedEntitiesForTransactions(userId, extractedByTransactionId);
      const processedUpload = await uploadData.updateUploadStatus(createdUpload.id, "PROCESSED", null);

      return this.toUploadDto(
        processedUpload,
        insertResult.count || 0,
        parsedTransactions.rejectedRows,
      );
    } catch (error) {
      if (createdUpload?.id) {
        try {
          await uploadData.updateUploadStatus(
            createdUpload.id,
            "FAILED",
            error?.message?.slice(0, 250) || "Failed to process uploaded statement",
          );
        } catch (_statusError) {
          // Keep original error because upload processing is the main failure reason.
        }
      }
      throw error;
    } finally {
      await deleteFile(filePath);
    }
  }

  async recent(userId) {
    const uploads = await uploadData.getUserStatementData(userId);

    const shapedUploads = uploads.map((upload) => {
      const status = (upload.uploadStatus || "").toUpperCase();
      let normalizedStatus = "Processing";
      if (status === "FAILED") {
        normalizedStatus = "Failed";
      } else if (status === "PROCESSED" || status === "COMPLETED") {
        normalizedStatus = "Processed";
      }

      return {
        id: upload.id,
        fileName: upload.fileName,
        type: upload.fileType,
        status: normalizedStatus,
        uploadDate: upload.uploadedAt || upload.createdAt,
      };
    });

    return {
      totalUploads: shapedUploads.length,
      failedUploads: shapedUploads.filter((upload) => upload.status === "Failed").length,
      processingUploads: shapedUploads.filter((upload) => upload.status === "Processing").length,
      completedUploads: shapedUploads.filter((upload) => upload.status === "Processed").length,
      lastProcessedFileName: shapedUploads[0]?.fileName || null,
      uploads: shapedUploads,
    };
  }

  extractEntitiesByTransactionId(transactions = []) {
    const extracted = new Map();

    transactions.forEach((transaction) => {
      const entityName = extractEntity(transaction?.description || "");
      if (!entityName) {
        return;
      }
      extracted.set(transaction.id, entityName);
    });

    return extracted;
  }

  /**
   * Get file type from file name so we can store it in DB.
   */
  getFileType(fileName = "") {
    const ext = fileName.split(".").pop()?.toUpperCase();
    if (ext === "XLS" || ext === "XLSX") {
      return ext;
    }
    return null;
  }

  /**
   * Build response data in the same format used by the API.
   */
  toUploadDto(uploadEntity, importedRows, rejectedRows) {
    return UploadDtoSchema.parse({
      id: uploadEntity.id,
      userId: uploadEntity.userId,
      fileName: uploadEntity.fileName,
      fileType: uploadEntity.fileType,
      uploadStatus: uploadEntity.uploadStatus,
      uploadedAt: uploadEntity.uploadedAt,
      createdAt: uploadEntity.createdAt,
      updatedAt: uploadEntity.updatedAt,
      importedRows,
      rejectedRows,
    });
  }
}

module.exports = new UploadService();
