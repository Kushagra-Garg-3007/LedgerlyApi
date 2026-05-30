const asyncHandler = require("../utils/asyncHandler");
const ledgerService = require("../services/ledger.service");
const { UpdateEntitiesWithCategorySchema } = require("../models/requestModel/updateEntitiesWithCategory.request.model");
const { UpdateTransactionAnnotationCategorySchema } = require("../models/requestModel/updateTransactionAnnotationCategory.request.model");
const { throwValidationError } = require("../utils/validation");

class LedgerController {
  constructor() {
    this.getSummary = asyncHandler(this.getSummary.bind(this));
    this.listTransactions = asyncHandler(this.listTransactions.bind(this));
    this.updateEntiesWithCategory = asyncHandler(this.updateEntiesWithCategory.bind(this));
    this.updateTransactionAnnotationCategory = asyncHandler(this.updateTransactionAnnotationCategory.bind(this));
  }

  async getSummary(req, res) {
    const summaryDto = await ledgerService.getSummary(req.user?.id);
    return res.status(200).json(summaryDto);
  }

  async listTransactions(req, res) {
    
    const transactionsDto = await ledgerService.listTransactions(req);
    return res.status(200).json(transactionsDto);
  }

  async updateEntiesWithCategory(req, res) {
    const parsedBody = UpdateEntitiesWithCategorySchema.safeParse(req.body);
    if (!parsedBody.success) {
      throwValidationError(parsedBody.error);
    }

    const result = await ledgerService.updateEntiesWithCategory(req.user?.id, parsedBody.data);
    return res.status(200).json(result);
  }

  async updateTransactionAnnotationCategory(req, res) {
    const parsedBody = UpdateEntitiesWithCategorySchema.safeParse(req.body);
    if (!parsedBody.success) {
      throwValidationError(parsedBody.error);
    }

    const result = await ledgerService.updateTransactionAnnotationCategory(
      req.user?.id,
      parsedBody.data,
    );
    return res.status(200).json(result);
  }
}

module.exports = new LedgerController();
