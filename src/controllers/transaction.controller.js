const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");
const transactionService = require("../services/transaction.service");
const { buildListTransactionsResponse } = require("../models/responseModel/listTransactions.response.model");
const {
  buildUpdateTransactionAnnotationResponse,
} = require("../models/responseModel/updateTransactionAnnotation.response.model");
const { buildValidationErrorResponse } = require("../models/responseModel/base.response.model");
const {
  UpdateTransactionAnnotationParamsSchema,
} = require("../models/requestModel/updateTransactionAnnotationParams.request.model");
const {
  UpdateTransactionAnnotationSchema,
} = require("../models/requestModel/updateTransactionAnnotation.request.model");

class TransactionController {
  constructor() {
    this.listTransactions = asyncHandler(this.listTransactions.bind(this));
    this.updateAnnotation = asyncHandler(this.updateAnnotation.bind(this));
  }

  async listTransactions(req, res) {
    const transactionsDto = await transactionService.listTransactions(req.user?.id);
    return ApiResponse.send(res, buildListTransactionsResponse(transactionsDto));
  }

  async updateAnnotation(req, res) {
    const parsedParams = UpdateTransactionAnnotationParamsSchema.safeParse(req.params);
    if (!parsedParams.success) {
      return ApiResponse.send(res, buildValidationErrorResponse(parsedParams.error));
    }

    const parsedBody = UpdateTransactionAnnotationSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return ApiResponse.send(res, buildValidationErrorResponse(parsedBody.error));
    }

    const annotationRequest = parsedBody.data;
    const annotationDto = await transactionService.updateAnnotation(
      parsedParams.data.id,
      req.user?.id,
      annotationRequest,
    );
    return ApiResponse.send(res, buildUpdateTransactionAnnotationResponse(annotationDto));
  }
}

module.exports = new TransactionController();
