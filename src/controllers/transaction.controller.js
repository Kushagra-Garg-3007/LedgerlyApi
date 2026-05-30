const asyncHandler = require("../utils/asyncHandler");
const transactionService = require("../services/transaction.service");
const {
  UpdateTransactionAnnotationParamsSchema,
} = require("../models/requestModel/updateTransactionAnnotationParams.request.model");
const {
  UpdateTransactionAnnotationSchema,
} = require("../models/requestModel/updateTransactionAnnotation.request.model");
const {
  AssignTransactionCategorySchema,
} = require("../models/requestModel/assignTransactionCategory.request.model");
const { throwValidationError } = require("../utils/validation");

class TransactionController {
  constructor() {
    this.listTransactions = asyncHandler(this.listTransactions.bind(this));
    this.updateAnnotation = asyncHandler(this.updateAnnotation.bind(this));
    this.updateCategory = asyncHandler(this.updateCategory.bind(this));
  }

  async listTransactions(req, res) {
    const transactionsDto = await transactionService.listTransactions(req.user?.id);
    return res.status(200).json(transactionsDto);
  }

  async updateAnnotation(req, res) {
    const parsedParams = UpdateTransactionAnnotationParamsSchema.safeParse(req.params);
    if (!parsedParams.success) {
      throwValidationError(parsedParams.error);
    }

    const parsedBody = UpdateTransactionAnnotationSchema.safeParse(req.body);
    if (!parsedBody.success) {
      throwValidationError(parsedBody.error);
    }

    const annotationRequest = parsedBody.data;
    const annotationDto = await transactionService.updateAnnotation(
      parsedParams.data.id,
      req.user?.id,
      annotationRequest,
    );
    if (!annotationDto) {
      const error = new Error("Transaction annotation not found");
      error.statusCode = 404;
      throw error;
    }

    return res.status(200).json(annotationDto);
  }

  async updateCategory(req, res) {
    const parsedParams = UpdateTransactionAnnotationParamsSchema.safeParse(req.params);
    if (!parsedParams.success) {
      throwValidationError(parsedParams.error);
    }

    const parsedBody = AssignTransactionCategorySchema.safeParse(req.body);
    if (!parsedBody.success) {
      throwValidationError(parsedBody.error);
    }

    if (parsedBody.data.applyToAll) {
      const result = await transactionService.applyCategoryToEntityTransactions(
        parsedParams.data.id,
        req.user?.id,
        parsedBody.data.categoryId,
      );
      return res.status(200).json(result);
    }

    const annotationDto = await transactionService.updateAnnotation(
      parsedParams.data.id,
      req.user?.id,
      {
        categoryId: parsedBody.data.categoryId,
      },
    );

    if (!annotationDto) {
      const error = new Error("Transaction annotation not found");
      error.statusCode = 404;
      throw error;
    }

    return res.status(200).json(annotationDto);
  }
}

module.exports = new TransactionController();
