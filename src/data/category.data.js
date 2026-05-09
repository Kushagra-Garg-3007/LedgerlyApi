const prisma = require("../config/prisma");

class CategoryData {
  async listGlobalByNames(names) {
    if (!Array.isArray(names) || names.length === 0) {
      return [];
    }

    try {
      return await prisma.category.findMany({
        where: {
          userId: null,
          name: { in: names },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async listByUserId(userId) {
    if (!userId) {
      return [];
    }

    try {
      return await prisma.category.findMany({
        where: {
          OR: [
            { userId: null },
            { userId },
          ],
        },
        orderBy: [
          { userId: "desc" },
          { name: "asc" },
        ],
      });
    } catch (error) {
      throw error;
    }
  }

  async findByIdAndUserId(categoryId, userId) {
    if (!categoryId || !userId) {
      return null;
    }

    try {
      return await prisma.category.findFirst({
        where: {
          id: categoryId,
          OR: [
            { userId: null },
            { userId },
          ],
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async createCategory(userId, name) {
    if (!userId || !name) {
      return null;
    }

    try {
      return await prisma.category.create({
        data: { userId, name },
      });
    } catch (error) {
      throw error;
    }
  }

  async updateCategoryName(categoryId, userId, name) {
    if (!categoryId || !userId || !name) {
      return null;
    }

    try {
      const category = await prisma.category.findFirst({
        where: { id: categoryId, userId },
      });

      if (!category) {
        return null;
      }

      return await prisma.category.update({
        where: { id: categoryId },
        data: { name },
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteCategory(categoryId, userId) {
    if (!categoryId || !userId) {
      return 0;
    }

    try {
      const result = await prisma.category.deleteMany({
        where: { id: categoryId, userId },
      });

      return result.count || 0;
    } catch (error) {
      throw error;
    }
  }

  async createManyIfMissing(rows) {
    if (!Array.isArray(rows) || rows.length === 0) {
      return { count: 0 };
    }

    try {
      return await prisma.category.createMany({
        data: rows,
        skipDuplicates: true,
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new CategoryData();
