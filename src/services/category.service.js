const categoryData = require("../data/category.data");
const { CategoryDtoSchema } = require("../models/dtos/category.dto");
const { normalizeName } = require("../utils/string.utils");

class CategoryService {
  // async ensureGlobalCategories() {
  //   const existingGlobalCategories = await categoryData.listGlobalByName(DEFAULT_CATEGORY_NAMES);
  //   const existingNames = new Set();
  //   for (const category of existingGlobalCategories) {
  //     existingNames.add(category.name);
  //   }

  //   const missingRows = [];
  //   for (const categoryName of DEFAULT_CATEGORY_NAMES) {
  //     if (!existingNames.has(categoryName)) {
  //       missingRows.push({
  //         userId: null,
  //         name: categoryName,
  //       });
  //     }
  //   }

  //   if (missingRows.length > 0) {
  //     await categoryData.createManyIfMissing(missingRows);
  //   }
  // }

  async listCategories(userId) {
    // await this.ensureGlobalCategories();
    const categories = await categoryData.listByUserId(userId);

    const categoryDtos = [];
    for (const category of categories) {
      categoryDtos.push(this.toCategoryDto(category));
    }

    return categoryDtos;
  }

  async createCategory(userId, name) {
    const normalizedName = normalizeName(name);
    try {
      const created = await categoryData.createCategory(userId, normalizedName);
      return this.toCategoryDto(created);
    } catch (error) {
      if (error?.code === "P2002") {
        const conflictError = new Error("Category name already exists");
        conflictError.statusCode = 409;
        throw conflictError;
      }
      throw error;
    }
  }

  async updateCategory(categoryId, userId, name) {
    const normalizedName = normalizedName(name);
    let updated = null;
    try {
      updated = await categoryData.updateCategoryName(categoryId, userId, normalizedName);
    } catch (error) {
      if (error?.code === "P2002") {
        const conflictError = new Error("Category name already exists");
        conflictError.statusCode = 409;
        throw conflictError;
      }
      throw error;
    }

    if (!updated) {
      const notFoundError = new Error("Category not found");
      notFoundError.statusCode = 404;
      throw notFoundError;
    }

    return this.toCategoryDto(updated);
  }

  async deleteCategory(categoryId, userId) {
    const deletedCount = await categoryData.deleteCategory(categoryId, userId);
    if (deletedCount === 0) {
      const notFoundError = new Error("Category not found");
      notFoundError.statusCode = 404;
      throw notFoundError;
    }
    return true;
  }

  toCategoryDto(category) {
    return CategoryDtoSchema.parse({
      id: category.id,
      userId: category.userId,
      name: category.name,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    });
  }
}

module.exports = new CategoryService();
