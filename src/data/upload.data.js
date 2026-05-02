function getPrisma() {
  return require("../config/prisma");
}

class UploadData {
  async createUploadRecord(payload) {
    const { userId, fileName, fileType = "CSV", uploadStatus = "PENDING" } = payload || {};

    if (!userId || !fileName) {
      return null;
    }

    return getPrisma().statementUpload.create({
      data: {
        userId,
        fileName,
        fileType,
        uploadStatus,
      },
    });
  }
}

module.exports = new UploadData();
