const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const categoryController = require("../controllers/category.controller");

const router = express.Router();

router.get("/", authMiddleware, categoryController.listCategories);
router.post("/", authMiddleware, categoryController.createCategory);
router.patch("/:id", authMiddleware, categoryController.updateCategory);
router.delete("/:id", authMiddleware, categoryController.deleteCategory);

module.exports = router;
