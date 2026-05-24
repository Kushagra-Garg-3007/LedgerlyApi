const asyncHandler = require("../utils/asyncHandler");
const uploadService = require("../services/upload.service");
const { UploadStatementSchema } = require("../models/requestModel/uploadStatement.request.model");
const { throwValidationError } = require("../utils/validation");

class UploadController {
  constructor() {
    this.uploadStatement = asyncHandler(this.uploadStatement.bind(this));
    this.recent = asyncHandler(this.recent.bind(this));
  }

  async uploadStatement(req, res) {
    const parsedRequest = UploadStatementSchema.safeParse({
      file: req.file,
      userId: req.user?.id,
    });
    if (!parsedRequest.success) {
      throwValidationError(parsedRequest.error);
    }

    const uploadRequest = parsedRequest.data;
    const uploadDto = await uploadService.uploadStatement(uploadRequest);

    if (!uploadDto) {
      const error = new Error("Invalid upload payload");
      error.statusCode = 400;
      throw error;
    }

    return res.status(201).json(uploadDto);
  }

  async recent(req, res) {
    const userId = req.user?.id;
    const uploads = await uploadService.recent(userId);

    return res.status(200).json(uploads);
  }
}

module.exports = new UploadController();
