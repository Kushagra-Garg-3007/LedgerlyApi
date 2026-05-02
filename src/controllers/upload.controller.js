const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");
const uploadService = require("../services/upload.service");
const { buildUploadStatementResponse } = require("../models/responseModel/uploadStatement.response.model");
const {
  buildUploadInvalidPayloadResponse,
} = require("../models/responseModel/uploadInvalidPayload.response.model");
const { buildValidationErrorResponse } = require("../models/responseModel/base.response.model");
const { UploadStatementSchema } = require("../models/requestModel/uploadStatement.request.model");

class UploadController {
  constructor() {
    this.uploadStatement = asyncHandler(this.uploadStatement.bind(this));
  }

  async uploadStatement(req, res) {
    const parsedRequest = UploadStatementSchema.safeParse({
      file: req.file,
      userId: req.user?.id,
    });
    if (!parsedRequest.success) {
      return ApiResponse.send(res, buildValidationErrorResponse(parsedRequest.error));
    }

    const uploadRequest = parsedRequest.data;
    const uploadDto = await uploadService.uploadStatement(uploadRequest);

    if (!uploadDto) {
      return ApiResponse.send(res, buildUploadInvalidPayloadResponse());
    }

    return ApiResponse.send(res, buildUploadStatementResponse(uploadDto));
  }
}

module.exports = new UploadController();
