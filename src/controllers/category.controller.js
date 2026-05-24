const asyncHandler = require("../utils/asyncHandler");
const categoryService = require("../services/category.service");
const { CreateCategorySchema } = require("../models/requestModel/createCategory.request.model");
const { UpdateCategorySchema } = require("../models/requestModel/updateCategory.request.model");
const { CategoryParamsSchema } = require("../models/requestModel/categoryParams.request.model");
const { throwValidationError } = require("../utils/validation");

class CategoryController {
  constructor() {
    this.listCategories = asyncHandler(this.listCategories.bind(this));
    this.createCategory = asyncHandler(this.createCategory.bind(this));
    this.updateCategory = asyncHandler(this.updateCategory.bind(this));
    this.deleteCategory = asyncHandler(this.deleteCategory.bind(this));
  }

  async listCategories(req, res) {
    const categories = await categoryService.listCategories(req.user?.id);
    return res.status(200).json(categories);
  }

  async createCategory(req, res) {
    const parsedBody = CreateCategorySchema.safeParse(req.body);
    if (!parsedBody.success) {
      throwValidationError(parsedBody.error);
    }

    const category = await categoryService.createCategory(req.user?.id, parsedBody.data.name);
    return res.status(201).json(category);
  }

  async updateCategory(req, res) {
    const parsedParams = CategoryParamsSchema.safeParse(req.params);
    if (!parsedParams.success) {
      throwValidationError(parsedParams.error);
    }

    const parsedBody = UpdateCategorySchema.safeParse(req.body);
    if (!parsedBody.success) {
      throwValidationError(parsedBody.error);
    }

    const category = await categoryService.updateCategory(
      parsedParams.data.id,
      req.user?.id,
      parsedBody.data.name,
    );

    return res.status(200).json(category);
  }

  async deleteCategory(req, res) {
    const parsedParams = CategoryParamsSchema.safeParse(req.params);
    if (!parsedParams.success) {
      throwValidationError(parsedParams.error);
    }

    const deleted = await categoryService.deleteCategory(parsedParams.data.id, req.user?.id);
    return res.status(200).json({ deleted });
  }
}

module.exports = new CategoryController();
