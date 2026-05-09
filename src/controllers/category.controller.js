const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");
const categoryService = require("../services/category.service");
const { buildValidationErrorResponse } = require("../models/responseModel/base.response.model");
const { buildListCategoriesResponse } = require("../models/responseModel/listCategories.response.model");
const { buildCreateCategoryResponse } = require("../models/responseModel/createCategory.response.model");
const { buildUpdateCategoryResponse } = require("../models/responseModel/updateCategory.response.model");
const { buildDeleteCategoryResponse } = require("../models/responseModel/deleteCategory.response.model");
const { CreateCategorySchema } = require("../models/requestModel/createCategory.request.model");
const { UpdateCategorySchema } = require("../models/requestModel/updateCategory.request.model");
const { CategoryParamsSchema } = require("../models/requestModel/categoryParams.request.model");

class CategoryController {
  constructor() {
    this.listCategories = asyncHandler(this.listCategories.bind(this));
    this.createCategory = asyncHandler(this.createCategory.bind(this));
    this.updateCategory = asyncHandler(this.updateCategory.bind(this));
    this.deleteCategory = asyncHandler(this.deleteCategory.bind(this));
  }

  async listCategories(req, res) {
    const categories = await categoryService.listCategories(req.user?.id);
    return ApiResponse.send(res, buildListCategoriesResponse(categories));
  }

  async createCategory(req, res) {
    const parsedBody = CreateCategorySchema.safeParse(req.body);
    if (!parsedBody.success) {
      return ApiResponse.send(res, buildValidationErrorResponse(parsedBody.error));
    }

    const category = await categoryService.createCategory(req.user?.id, parsedBody.data.name);
    return ApiResponse.send(res, buildCreateCategoryResponse(category));
  }

  async updateCategory(req, res) {
    const parsedParams = CategoryParamsSchema.safeParse(req.params);
    if (!parsedParams.success) {
      return ApiResponse.send(res, buildValidationErrorResponse(parsedParams.error));
    }

    const parsedBody = UpdateCategorySchema.safeParse(req.body);
    if (!parsedBody.success) {
      return ApiResponse.send(res, buildValidationErrorResponse(parsedBody.error));
    }

    const category = await categoryService.updateCategory(
      parsedParams.data.id,
      req.user?.id,
      parsedBody.data.name,
    );

    return ApiResponse.send(res, buildUpdateCategoryResponse(category));
  }

  async deleteCategory(req, res) {
    const parsedParams = CategoryParamsSchema.safeParse(req.params);
    if (!parsedParams.success) {
      return ApiResponse.send(res, buildValidationErrorResponse(parsedParams.error));
    }

    const deleted = await categoryService.deleteCategory(parsedParams.data.id, req.user?.id);
    return ApiResponse.send(res, buildDeleteCategoryResponse(deleted));
  }
}

module.exports = new CategoryController();
