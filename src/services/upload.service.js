const uploadData = require("../data/upload.data");
const { UploadDtoSchema } = require("../models/dtos/upload.dto");

class UploadService {
  async uploadStatement({ file, userId }) {
    const createdUpload = await uploadData.createUploadRecord({
      userId,
      fileName: file?.originalname,
      fileType: this.getFileType(file?.originalname),
      uploadStatus: "PENDING",
    });

    if (!createdUpload) {
      return null;
    }

    return UploadDtoSchema.parse({
      id: createdUpload.id,
      userId: createdUpload.userId,
      fileName: createdUpload.fileName,
      fileType: createdUpload.fileType,
      uploadStatus: createdUpload.uploadStatus,
      uploadedAt: createdUpload.uploadedAt,
      createdAt: createdUpload.createdAt,
      updatedAt: createdUpload.updatedAt,
    });
  }

  getFileType(fileName = "") {
    const ext = fileName.split(".").pop()?.toUpperCase();
    if (ext === "XLS" || ext === "XLSX") {
      return ext;
    }
    return "CSV";
  }
}

module.exports = new UploadService();
