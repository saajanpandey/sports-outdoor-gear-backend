const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

// Routes
router.post("/", categoryController.createCategory);
router.get("/", categoryController.getAllCategory);
router.get("/:name", categoryController.getCategoryByName);
router.put("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
